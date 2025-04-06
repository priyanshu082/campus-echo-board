
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "./AuthContext";
import { authAPI } from "./AuthContext";

// Define notice interface
export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
  important: boolean;
}

interface NoticeContextType {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, "id" | "createdAt" | "authorName">) => Promise<boolean>;
  deleteNotice: (id: string, user: User) => Promise<boolean>;
  filterNoticesByDate: (startDate?: Date, endDate?: Date) => Promise<Notice[]>;
  fetchNotices: () => Promise<void>;
  isLoading: boolean;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch notices on component mount
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authAPI.get("/notices");
      
      // Convert string dates to Date objects
      const fetchedNotices = response.data.map((notice: any) => ({
        ...notice,
        createdAt: new Date(notice.createdAt)
      }));
      
      setNotices(fetchedNotices);
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      toast({
        title: "Error",
        description: "Failed to load notices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNotice = async (
    notice: Omit<Notice, "id" | "createdAt" | "authorName">
  ): Promise<boolean> => {
    try {
      const response = await authAPI.post("/notices", notice);
      
      // Convert createdAt string to Date object
      const newNotice = {
        ...response.data,
        createdAt: new Date(response.data.createdAt)
      };
      
      setNotices([newNotice, ...notices]);
      toast({
        title: "Notice posted",
        description: "Your notice has been successfully posted.",
      });
      return true;
    } catch (error: any) {
      console.error("Failed to add notice:", error);
      const message = error.response?.data?.message || "Failed to post notice";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteNotice = async (id: string, user: User): Promise<boolean> => {
    try {
      await authAPI.delete(`/notices/${id}`);
      
      setNotices(notices.filter((notice) => notice.id !== id));
      toast({
        title: "Notice deleted",
        description: "The notice has been removed from the board.",
      });
      return true;
    } catch (error: any) {
      console.error("Failed to delete notice:", error);
      const message = error.response?.data?.message || "Failed to delete notice";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return false;
    }
  };

  const filterNoticesByDate = async (startDate?: Date, endDate?: Date): Promise<Notice[]> => {
    try {
      let url = "/notices";
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append("startDate", startDate.toISOString());
      }
      
      if (endDate) {
        params.append("endDate", endDate.toISOString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await authAPI.get(url);
      
      // Convert string dates to Date objects
      return response.data.map((notice: any) => ({
        ...notice,
        createdAt: new Date(notice.createdAt)
      }));
    } catch (error) {
      console.error("Failed to filter notices:", error);
      throw error;
    }
  };

  return (
    <NoticeContext.Provider
      value={{
        notices,
        addNotice,
        deleteNotice,
        filterNoticesByDate,
        fetchNotices,
        isLoading
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotices = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error("useNotices must be used within a NoticeProvider");
  }
  return context;
};
