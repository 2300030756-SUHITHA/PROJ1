import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { StarRating } from '@/components/StarRating';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Shield, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star, 
  LogOut, 
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { feedbacks, deleteFeedback, getAnalytics } = useFeedback();
  const { toast } = useToast();
  
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const analytics = getAnalytics();
  const services = [...new Set(feedbacks.map(f => f.serviceOrProduct))];

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesRating = filterRating === 'all' || feedback.rating.toString() === filterRating;
    const matchesService = filterService === 'all' || feedback.serviceOrProduct === filterService;
    const matchesSearch = searchTerm === '' || 
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRating && matchesService && matchesSearch;
  });

  const handleDeleteFeedback = (feedbackId: string) => {
    deleteFeedback(feedbackId);
    toast({
      title: "Success",
      description: "Feedback deleted successfully!",
    });
  };

  // Chart data
  const ratingDistributionData = Object.entries(analytics.ratingDistribution).map(([rating, count]) => ({
    rating: `${rating} Star${rating !== '1' ? 's' : ''}`,
    count
  }));

  const serviceDistributionData = Object.entries(analytics.serviceDistribution).map(([service, count]) => ({
    name: service,
    value: count
  }));

  const sentimentData = [
    { name: 'Positive', value: analytics.sentimentDistribution.positive, color: '#10b981' },
    { name: 'Neutral', value: analytics.sentimentDistribution.neutral, color: '#f59e0b' },
    { name: 'Negative', value: analytics.sentimentDistribution.negative, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Feedback</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.totalFeedbacks}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-bold text-foreground">{analytics.averageRating.toFixed(1)}</p>
                </div>
                <Star className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Positive Reviews</p>
                  <p className="text-3xl font-bold text-success">{analytics.sentimentDistribution.positive}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold text-foreground">{new Set(feedbacks.map(f => f.userId)).size}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Breakdown of feedback ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>AI-powered sentiment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Management */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Feedback Management
            </CardTitle>
            <CardDescription>
              View, filter, and manage all customer feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback or users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No feedback found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </div>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4 bg-background/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-foreground">
                            {feedback.userName}
                          </span>
                          <StarRating rating={feedback.rating} readonly size="sm" />
                        </div>
                        <span className="text-sm font-medium text-foreground px-3 py-1 bg-secondary rounded-full">
                          {feedback.serviceOrProduct}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          feedback.sentiment === 'positive' ? 'bg-success/10 text-success' :
                          feedback.sentiment === 'negative' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {feedback.sentiment}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(feedback.timestamp, 'PPP')}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteFeedback(feedback.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-foreground">{feedback.comment}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;