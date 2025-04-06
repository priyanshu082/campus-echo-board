
import React, { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminPage: React.FC = () => {
  const { isAuthenticated, user, users, addUser, updateUserRole, deleteUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "defaultpassword", // Default password for new users
    role: "STUDENT" as UserRole,
  });

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [adminCount, setAdminCount] = useState(0);

  // Redirect if not authenticated or if user is not an admin
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user?.role !== "ADMIN") {
      navigate("/");
    }
    
    // Count admins
    if (users && users.length > 0) {
      setAdminCount(users.filter(u => u.role === "ADMIN").length);
    }
  }, [isAuthenticated, user, navigate, users]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast({
        title: "Validation error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Validation error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email is already in use
    if (users.some((u) => u.email === newUser.email)) {
      toast({
        title: "Error",
        description: "This email is already in use. Please use a different email.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if trying to add more than 2 admins
    if (newUser.role === "ADMIN" && adminCount >= 2) {
      toast({
        title: "Error",
        description: "Maximum of 2 admin users already exist.",
        variant: "destructive",
      });
      return;
    }
    
    addUser(newUser);
    
    // Reset form
    setNewUser({
      name: "",
      email: "",
      password: "defaultpassword",
      role: "STUDENT",
    });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // Don't allow changing role if it would exceed 2 admins
    if (newRole === "ADMIN" && adminCount >= 2) {
      toast({
        title: "Error",
        description: "Maximum of 2 admin users already exist.",
        variant: "destructive",
      });
      return;
    }
    
    updateUserRole(userId, newRole);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  // Return null while checking authentication to avoid flashing content
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="py-4 animate-fade-in">
      <h1 className="mb-6 text-3xl font-bold text-center">Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="add-user">Add New User</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Role</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="p-2 border">{u.name}</td>
                        <td className="p-2 border">{u.email}</td>
                        <td className="p-2 border">
                          <span 
                            className={`px-2 py-0.5 rounded-full text-white text-xs
                              ${u.role === 'ADMIN' ? 'bg-admin' : 
                                u.role === 'TEACHER' ? 'bg-teacher' : 'bg-student'}`}
                          >
                            {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="p-2 border">
                          <div className="flex space-x-2">
                            {/* Don't show role dropdown for the current admin */}
                            {u.id !== user.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">Change Role</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem 
                                    onClick={() => handleRoleChange(u.id, "STUDENT")}
                                    disabled={u.role === "STUDENT"}
                                  >
                                    Student
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleRoleChange(u.id, "TEACHER")}
                                    disabled={u.role === "TEACHER"}
                                  >
                                    Teacher
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleRoleChange(u.id, "ADMIN")}
                                    disabled={u.role === "ADMIN" || adminCount >= 2}
                                  >
                                    Admin {adminCount >= 2 && "(Max 2)"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                            
                            {/* Don't show delete button for the current admin */}
                            {u.id !== user.id && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setUserToDelete(u.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-user">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="user@school.edu"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => 
                      setNewUser({ ...newUser, role: e.target.value as UserRole })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN" disabled={adminCount >= 2}>Admin {adminCount >= 2 && "(Max 2)"}</option>
                  </select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-admin hover:bg-admin-hover"
                >
                  Add User
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
