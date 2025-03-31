import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Mail, MapPin, Phone, Users } from "lucide-react";

const AdvocateDashboardPage = () => {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [advocateData, setAdvocateData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch advocate details when user is available
  useEffect(() => {
    if (!user) return;
    
    const fetchAdvocateData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/advocates");
        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch advocate data");
        }
        
        // Find the advocate that matches the current user ID
        const advocateInfo = data.data.find((adv: any) => adv.userId === user.id);
        setAdvocateData(advocateInfo);
      } catch (error) {
        console.error("Error fetching advocate data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdvocateData();
  }, [user]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Redirect if not logged in or not an advocate
  if (!user) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
        <p className="mb-6">You need to be logged in as an advocate to access this page.</p>
        <Button onClick={() => navigate("/signin")}>Sign In</Button>
      </div>
    );
  }

  if (user.role !== "advocate") {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
        <p className="mb-6">This page is only available to advocate accounts.</p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advocate Dashboard</h1>
          <p className="text-gray-600">Manage your profile and client connections</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="self-start"
        >
          Sign Out
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600">Loading advocate data...</p>
        </div>
      ) : advocateData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="shadow-md border-black">
              <CardHeader className="pb-4 bg-black text-white rounded-t-lg">
                <CardTitle>{user.fullName}</CardTitle>
                <CardDescription className="text-gray-300">{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Profile Summary */}
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="px-3 py-1.5">
                      {advocateData.rating ? `${advocateData.rating.toFixed(1)} ★` : "New"} 
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1.5">
                      {advocateData.reviewCount || 0} reviews
                    </Badge>
                    <Badge className="px-3 py-1.5 bg-primary">
                      {advocateData.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Basic Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-500" />
                      <span>{advocateData.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      <span>{advocateData.location?.city}, {advocateData.location?.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span>{user.phone || "No phone number"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <div className="text-2xl font-semibold">
                        {/* This would come from the backend in a real app */}
                        {Math.floor(Math.random() * 20)}
                      </div>
                      <div className="text-xs text-gray-500">Active Clients</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <div className="text-2xl font-semibold">
                        {/* This would come from the backend in a real app */}
                        {Math.floor(Math.random() * 50)}
                      </div>
                      <div className="text-xs text-gray-500">Total Cases</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="shadow-md border-black">
              <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                  <TabsTrigger value="cases">Cases</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Professional Information</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Bio</h4>
                          <p className="mt-1 text-gray-600">{advocateData.bio}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">Bar Council Number</h4>
                          <p className="mt-1 text-gray-600">{advocateData.barCouncilNumber}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700">Practice Areas</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {advocateData.specialties?.map((specialty: any) => (
                              <Badge key={specialty.id} variant="outline" className="px-3 py-1">
                                {specialty.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="text-center">
                      <Button className="bg-primary text-black hover:bg-[#e6c200]">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Clients Tab */}
                <TabsContent value="clients" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Your Clients</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Users size={16} className="mr-2" />
                          Client Requests (3)
                        </Button>
                      </div>
                    </div>

                    {/* Placeholder content for clients tab */}
                    <div className="py-12 text-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        Client management functionality will be implemented soon.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Cases Tab */}
                <TabsContent value="cases" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Your Cases</h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Calendar size={16} className="mr-2" />
                          Upcoming Hearings
                        </Button>
                      </div>
                    </div>

                    {/* Placeholder content for cases tab */}
                    <div className="py-12 text-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        Case management functionality will be implemented soon.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600">Could not find advocate profile. Please complete your registration.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/register")}
          >
            Complete Registration
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvocateDashboardPage;