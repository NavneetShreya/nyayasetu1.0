import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { testCredentials } from "@/lib/test-credentials";

// UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Type for login form
type LoginFormValues = z.infer<typeof loginSchema>;

const SignInPage = () => {
  const [activeTab, setActiveTab] = useState<string>("client");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Set up the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Set up the login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.fullName || data.user.username}!`,
      });
      
      // Redirect based on user role
      if (data.user.role === "advocate") {
        navigate("/advocate-dashboard");
      } else {
        navigate("/");
      }
      
      // Invalidate user queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-220px)]">
      <Card className="w-full max-w-md shadow-lg border-black border">
        <CardHeader className="space-y-1 bg-black text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Sign In to NyayaSetu</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="client" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="advocate">Advocate</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your username or email"
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-black hover:bg-[#e6c200]"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : `Sign in as ${activeTab === "client" ? "Client" : "Advocate"}`}
              </Button>
              
              {/* Test credentials section */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium mb-2">Test Account Credentials:</h3>
                <div className="space-y-2 text-xs">
                  {activeTab === "client" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Username:</span>
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => form.setValue("username", testCredentials.clients[0].username)}
                        >
                          {testCredentials.clients[0].username}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Password:</span>
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => form.setValue("password", testCredentials.clients[0].password)}
                        >
                          {testCredentials.clients[0].password}
                        </span>
                      </div>
                      <div className="text-gray-500 italic">
                        {testCredentials.clients[0].description}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Username:</span>
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => form.setValue("username", testCredentials.advocates[0].username)}
                        >
                          {testCredentials.advocates[0].username}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Password:</span>
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => form.setValue("password", testCredentials.advocates[0].password)}
                        >
                          {testCredentials.advocates[0].password}
                        </span>
                      </div>
                      <div className="text-gray-500 italic">
                        {testCredentials.advocates[0].description}
                      </div>
                    </>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Click on the credentials to autofill
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 bg-gray-50 p-6 rounded-b-lg">
          <div className="text-sm text-center text-gray-700">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;