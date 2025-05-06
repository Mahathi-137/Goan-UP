import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import VillagePage from "@/pages/village-page";
import SectorsPage from "@/pages/sectors-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import ChatbotPage from "@/pages/chatbot-page";
import FeedbackPage from "@/pages/feedback-page";

import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/village" component={VillagePage} />
      <Route path="/sectors" component={SectorsPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/chatbot" component={ChatbotPage} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Check for visible animated elements on scroll
  useEffect(() => {
    const checkVisibility = () => {
      const elements = document.querySelectorAll('.animated-element');
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementVisible = 150;
        
        if (rect.top < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    window.addEventListener('load', checkVisibility);
    
    // Initial check
    checkVisibility();
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      window.removeEventListener('load', checkVisibility);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
