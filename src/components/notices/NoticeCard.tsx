
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Notice } from "@/context/NoticeContext";
import { useAuth, User } from "@/context/AuthContext";
import { useNotices } from "@/context/NoticeContext";

interface NoticeCardProps {
  notice: Notice;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const { user } = useAuth();
  const { deleteNotice } = useNotices();

  const formattedDate = formatDistanceToNow(new Date(notice.createdAt), {
    addSuffix: true,
  });

  const canDelete = (user: User | null, notice: Notice): boolean => {
    if (!user) return false;
    
    // Admin can delete any notice
    if (user.role === "ADMIN") return true;
    
    // Teachers can only delete their own notices
    if (user.role === "TEACHER") {
      return user.id === notice.authorId;
    }
    
    // Students cannot delete any notice
    return false;
  };

  const handleDelete = () => {
    if (user) {
      deleteNotice(notice.id, user);
    }
  };

  return (
    <Card className={`relative transition-all duration-300 hover:shadow-md ${notice.important ? 'border-l-4 border-l-red-500' : ''}`}>
      {notice.important && (
        <div className="absolute top-2 right-2 text-red-500">
          <AlertTriangle size={18} />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{notice.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{notice.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-2 border-t">
        <div className="flex justify-between w-full">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {notice.authorName}
            </p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
          {canDelete(user, notice) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoticeCard;
