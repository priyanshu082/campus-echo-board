
import React, { useState } from "react";
import { Notice } from "@/context/NoticeContext";
import NoticeCard from "./NoticeCard";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";

interface NoticeListProps {
  notices: Notice[];
}

const NoticeList: React.FC<NoticeListProps> = ({ notices }) => {
  const [filter, setFilter] = useState<"all" | "important">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredNotices = notices
    .filter((notice) => {
      if (filter === "important") return notice.important;
      return true;
    })
    .filter((notice) => {
      if (!dateRange?.from) return true;
      
      const noticeDate = new Date(notice.createdAt);
      
      // If we have a start date but no end date
      if (dateRange.from && !dateRange.to) {
        return noticeDate >= dateRange.from;
      }
      
      // If we have both start and end date
      if (dateRange.from && dateRange.to) {
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        return noticeDate >= dateRange.from && noticeDate <= endOfDay;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
            <Label htmlFor="date-range" className="block mb-1">Date range</Label>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
              placeholder="Select date range"
              align="start"
            />
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
