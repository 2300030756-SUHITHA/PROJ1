import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Shield, Users, Star, ArrowRight, BarChart3 } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/customer-feedback');
      }
    }
  }, [user, navigate]);

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm font-medium">Feedback Management System</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Transform Customer
              <span className="text-primary block">Feedback Into Growth</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Collect, analyze, and act on customer feedback with our comprehensive management system. 
              Built with AI-powered sentiment analysis and real-time analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8 py-3"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need to manage customer feedback effectively</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-medium hover:shadow-large transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Customer Portal</CardTitle>
              <CardDescription>
                Easy-to-use interface for customers to submit and manage their feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  Star rating system
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Edit & delete own feedback
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  Secure authentication
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Comprehensive management tools for administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Analytics & insights
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Feedback management
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  Rating analysis
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-large transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI Analytics</CardTitle>
              <CardDescription>
                Advanced sentiment analysis and data insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-success" />
                  Sentiment detection
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Visual charts
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  Rating trends
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Feedback Process?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of businesses already using our platform to improve customer satisfaction.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-lg px-8 py-3"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
