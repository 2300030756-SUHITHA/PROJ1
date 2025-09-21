import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StarRating } from '@/components/StarRating';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Plus, Edit2, Trash2, LogOut, Star } from 'lucide-react';
import { format } from 'date-fns';

const services = [
  'Swiggy',
  'Zomato',
  'SBI',
  'ICICI',
  'HDFC Bank',
  'Amazon',
  'Flipkart',
  'Netflix',
  'Spotify',
  'Uber',
  'Ola'
];

const CustomerFeedback = () => {
  const { user, logout } = useAuth();
  const { addFeedback, updateFeedback, deleteFeedback, getUserFeedbacks } = useFeedback();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [serviceOrProduct, setServiceOrProduct] = useState('');
  const [editingFeedback, setEditingFeedback] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userFeedbacks = getUserFeedbacks(user?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !comment.trim() || !serviceOrProduct) {
      toast({
        title: "Error",
        description: "Please fill in all fields and provide a rating",
        variant: "destructive"
      });
      return;
    }

    if (editingFeedback) {
      updateFeedback(editingFeedback.id, {
        rating,
        comment: comment.trim(),
        serviceOrProduct
      });
      toast({
        title: "Success",
        description: "Feedback updated successfully!",
      });
      setEditingFeedback(null);
    } else {
      addFeedback({
        rating,
        comment: comment.trim(),
        serviceOrProduct
      });
      toast({
        title: "Success",
        description: "Feedback submitted successfully!",
      });
    }
    
    setRating(0);
    setComment('');
    setServiceOrProduct('');
    setIsDialogOpen(false);
  };

  const handleEdit = (feedback: any) => {
    setEditingFeedback(feedback);
    setRating(feedback.rating);
    setComment(feedback.comment);
    setServiceOrProduct(feedback.serviceOrProduct);
    setIsDialogOpen(true);
  };

  const handleDelete = (feedbackId: string) => {
    deleteFeedback(feedbackId);
    toast({
      title: "Success",
      description: "Feedback deleted successfully!",
    });
  };

  const resetForm = () => {
    setEditingFeedback(null);
    setRating(0);
    setComment('');
    setServiceOrProduct('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <div className="bg-card border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Feedback Portal</h1>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Share Your Feedback
                </CardTitle>
                <CardDescription>
                  Help us improve by sharing your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingFeedback ? 'Edit Feedback' : 'Submit New Feedback'}
                      </DialogTitle>
                      <DialogDescription>
                        Share your experience to help us improve our services.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex items-center gap-2">
                          <StarRating 
                            rating={rating} 
                            onRatingChange={setRating}
                            size="lg"
                          />
                          <span className="text-sm text-muted-foreground">
                            {rating > 0 && `${rating} star${rating !== 1 ? 's' : ''}`}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service">Service/Product</Label>
                        <Select value={serviceOrProduct} onValueChange={setServiceOrProduct}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service or product" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comment">Your Feedback</Label>
                        <Textarea
                          id="comment"
                          placeholder="Share your experience in detail..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          className="resize-none"
                          required
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-gradient-to-r from-primary to-primary/90"
                        >
                          {editingFeedback ? 'Update' : 'Submit'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Feedback History */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Your Feedback History</CardTitle>
                <CardDescription>
                  {userFeedbacks.length} feedback{userFeedbacks.length !== 1 ? 's' : ''} submitted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userFeedbacks.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No feedback yet</h3>
                    <p className="text-muted-foreground">Start by sharing your first feedback!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userFeedbacks.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-4 bg-background/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <StarRating rating={feedback.rating} readonly size="sm" />
                            <span className="text-sm font-medium text-foreground">
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(feedback)}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(feedback.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-foreground mb-2">{feedback.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(feedback.timestamp, 'PPP')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedback;