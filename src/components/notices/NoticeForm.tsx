
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useNotices } from "@/context/NoticeContext";
import { toast } from "@/components/ui/use-toast";

const NoticeForm: React.FC = () => {
  const { user } = useAuth();
  const { addNotice } = useNotices();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post a notice.",
        variant: "destructive",
      });
      return;
    }
    
    if (title.trim() === "" || content.trim() === "") {
      toast({
        title: "Validation error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addNotice({
        title,
        content,
        authorId: user.id,
        authorName: user.name,
        important,
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setImportant(false);
      
      // Navigate back to home page
      navigate("/");
    } catch (error) {
      console.error("Failed to add notice:", error);
      toast({
        title: "Error",
        description: "Failed to post notice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter notice title"
              maxLength={100}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 min-h-[150px] border rounded-md"
              placeholder="Enter notice content"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="important"
              checked={important}
              onCheckedChange={setImportant}
            />
            <Label htmlFor="important">Mark as important</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-notice hover:bg-notice-hover"
          >
            {isSubmitting ? "Posting..." : "Post Notice"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NoticeForm;
