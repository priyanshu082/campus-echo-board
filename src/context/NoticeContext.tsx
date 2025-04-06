
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "./AuthContext";

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

// Mock notices for demonstration
const mockNotices: Notice[] = [
  {
    id: "1",
    title: "End of Term Examination Schedule",
    content: "The end of term examinations will begin on July 1st, 2025. All students should review the exam timetable posted on the school website.",
    createdAt: new Date(2025, 3, 1), // April 1, 2025
    authorId: "2",
    authorName: "Teacher Smith",
    important: true,
  },
  {
    id: "2",
    title: "School Science Fair",
    content: "The annual science fair will be held on April 15th, 2025. Students interested in participating should register by April 10th with their science teachers.",
    createdAt: new Date(2025, 3, 4), // April 4, 2025
    authorId: "3",
    authorName: "Teacher Johnson",
    important: false,
  },
  {
    id: "3",
    title: "Parent-Teacher Conference",
    content: "Parent-Teacher conferences are scheduled for April 20th-21st, 2025. Please check the online portal to book your appointment slots.",
    createdAt: new Date(2025, 3, 5), // April 5, 2025
    authorId: "2",
    authorName: "Teacher Smith",
    important: true,
  },
];

interface NoticeContextType {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, "id" | "createdAt" | "authorName">) => void;
  deleteNotice: (id: string, user: User) => boolean;
  filterNoticesByDate: (startDate?: Date, endDate?: Date) => Notice[];
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const { toast } = useToast();

  const addNotice = (
    notice: Omit<Notice, "id" | "createdAt" | "authorName">
  ) => {
    const newNotice: Notice = {
      ...notice,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date(),
      authorName: "", // This will be filled by the component based on current user
    };

    setNotices([newNotice, ...notices]);
    toast({
      title: "Notice posted",
      description: "Your notice has been successfully posted.",
    });
  };

  const deleteNotice = (id: string, user: User): boolean => {
    const notice = notices.find((n) => n.id === id);
    
    if (!notice) {
      toast({
        title: "Error",
        description: "Notice not found",
        variant: "destructive",
      });
      return false;
    }

    // Check if user is authorized to delete the notice
    if (user.role === "admin" || (user.role === "teacher" && notice.authorId === user.id)) {
      setNotices(notices.filter((notice) => notice.id !== id));
      toast({
        title: "Notice deleted",
        description: "The notice has been removed from the board.",
      });
      return true;
    } else {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete this notice.",
        variant: "destructive",
      });
      return false;
    }
  };

  const filterNoticesByDate = (startDate?: Date, endDate?: Date): Notice[] => {
    return notices.filter((notice) => {
      if (startDate && notice.createdAt < startDate) {
        return false;
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (notice.createdAt > endOfDay) {
          return false;
        }
      }
      return true;
    });
  };

  return (
    <NoticeContext.Provider
      value={{
        notices,
        addNotice,
        deleteNotice,
        filterNoticesByDate,
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
