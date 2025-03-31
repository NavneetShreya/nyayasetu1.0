import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import AdvocatesPage from "@/pages/AdvocatesPage";
import AdvocateDetailPage from "@/pages/AdvocateDetailPage";
import SignInPage from "@/pages/SignInPage";
import RegisterPage from "@/pages/RegisterPage";
import ContactPage from "@/pages/ContactPage";
import AdvocateDashboardPage from "@/pages/AdvocateDashboardPage";
import FAQPage from "@/pages/FAQPage";
import NotFound from "@/pages/not-found";
import ChatWidget from "@/components/chatbot/ChatWidget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/advocates" component={AdvocatesPage} />
      <Route path="/advocate/:id" component={AdvocateDetailPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/advocate-dashboard" component={AdvocateDashboardPage} />
      <Route path="/faq" component={FAQPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <ChatWidget />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
