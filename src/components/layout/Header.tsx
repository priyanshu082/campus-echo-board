import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BellIcon } from "lucide-react";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleBadgeClass = () => {
    if (user?.role === "ADMIN") return "bg-admin text-white";
    if (user?.role === "TEACHER") return "bg-teacher text-white";
    return "bg-student text-white";
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <div className="flex items-center">
          <BellIcon className="w-8 h-8 text-notice mr-2" />
          <h1 
            className="text-xl font-bold cursor-pointer sm:text-2xl"
            onClick={() => navigate("/")}
          >
            Notice
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="hidden mr-4 sm:block">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${getRoleBadgeClass()}`}>
                  {user?.role === "ADMIN" ? "Admin" : 
                   user?.role === "TEACHER" ? "Teacher" : "Student"}
                </div>
              </div>
              
              {/* Admin link visible on both mobile and desktop */}
              {user?.role === "ADMIN" && (
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </Button>
              )}
              
              {/* Only teachers can create notices */}
              {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => navigate("/create")}
                >
                  New Notice
                </Button>
              )}
              
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleLogin} variant="outline">Login</Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
