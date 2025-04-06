
import React, { useState } from "react";
import { Notice } from "@/context/NoticeContext";
import NoticeCard from "./NoticeCard";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NoticeListProps {
  notices: Notice[];
}

const NoticeList: React.FC<NoticeListProps> = ({ notices }) => {
  const [filter, setFilter] = useState<"all" | "important">("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const filteredNotices = notices
    .filter((notice) => {
      if (filter === "important") return notice.important;
      return true;
    })
    .filter((notice) => {
      if (!date) return true;
      
      const noticeDate = new Date(notice.createdAt);
      return (
        noticeDate.getDate() === date.getDate() &&
        noticeDate.getMonth() === date.getMonth() &&
        noticeDate.getFullYear() === date.getFullYear()
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const clearDate = () => {
    setDate(undefined);
  };

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <Label htmlFor="notice-filter">Filter notices</Label>
            <select
              id="notice-filter"
              className="w-full p-2 border rounded-md sm:w-40"
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "important")}
            >
              <option value="all">All Notices</option>
              <option value="important">Important Only</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Label htmlFor="date-filter" className="block mb-1">Filter by date</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-filter"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {date && (
                <Button variant="ghost" onClick={clearDate} size="icon">
                  ✕
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="p-10 text-center text-gray-500 border rounded-md">
          <p>No notices found for the selected criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeList;
