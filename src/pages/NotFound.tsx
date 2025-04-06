
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-6xl font-bold text-notice">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="mt-8 bg-notice hover:bg-notice-hover"
      >
        Return to Home
      </Button>
    </div>
  );
};

export default NotFound;
