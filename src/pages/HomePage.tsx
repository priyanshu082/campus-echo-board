
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotices } from "@/context/NoticeContext";
import NoticeList from "@/components/notices/NoticeList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { notices } = useNotices();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
        <div className="animate-fade-in space-y-3">
          <h1 className="text-4xl font-bold sm:text-5xl">Welcome to Campus Echo Board</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Your school's digital notice board for important announcements and updates.
          </p>
        </div>
        
        <div className="w-full max-w-md p-8 mx-auto mt-8 bg-white border rounded-lg shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Please log in to continue</h2>
          <Button 
            onClick={() => navigate("/login")}
            className="w-full bg-notice hover:bg-notice-hover"
            size="lg"
          >
            Login to View Notices
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="mb-4 text-2xl font-semibold">About Campus Echo Board</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="mb-2 text-lg font-medium">For Students</h3>
              <p className="text-gray-600">Stay updated with important notices and announcements from your teachers.</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="mb-2 text-lg font-medium">For Teachers</h3>
              <p className="text-gray-600">Post and manage notices for your classes and school activities.</p>
            </div>
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="mb-2 text-lg font-medium">For Administrators</h3>
              <p className="text-gray-600">Manage users and oversee all notices across the platform.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Notice Board</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}!
          </p>
        </div>
        
        {(user?.role === "teacher" || user?.role === "admin") && (
          <Button 
            onClick={() => navigate("/create")}
            className="bg-notice hover:bg-notice-hover w-full sm:w-auto"
          >
            Create New Notice
          </Button>
        )}
      </div>
      
      <NoticeList notices={notices} />
    </div>
  );
};

export default HomePage;
