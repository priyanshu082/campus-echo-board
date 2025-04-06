
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import NoticeForm from "@/components/notices/NoticeForm";

const CreateNoticePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or if user is not a teacher or admin
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user?.role !== "teacher" && user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Return null while checking authentication to avoid flashing content
  if (!isAuthenticated || (user?.role !== "teacher" && user?.role !== "admin")) {
    return null;
  }

  return (
    <div className="py-4 animate-fade-in">
      <h1 className="mb-6 text-3xl font-bold text-center">Create New Notice</h1>
      <NoticeForm />
    </div>
  );
};

export default CreateNoticePage;
