"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMockUrls } from "@/lib/data";
import { useState } from "react";
import UrlTable from "./url-table";

// Get mock data
const allUrls = getMockUrls();

export default function UrlDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_desc");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter URLs based on search query and status
  const filteredUrls = allUrls.filter((url) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const now = new Date();
    const isExpired = new Date(url.expiresAt) < now;

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && !isExpired;
    if (statusFilter === "expired") return matchesSearch && isExpired;

    return matchesSearch;
  });

  // Sort URLs
  const sortedUrls = [...filteredUrls].sort((a, b) => {
    switch (sortBy) {
      case "created_desc":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "created_asc":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "expires_desc":
        return (
          new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime()
        );
      case "expires_asc":
        return (
          new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
        );
      case "original_az":
        return a.originalUrl.localeCompare(b.originalUrl);
      case "original_za":
        return b.originalUrl.localeCompare(a.originalUrl);
      case "clicks_desc":
        return b.clicks - a.clicks;
      case "clicks_asc":
        return a.clicks - b.clicks;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search URLs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Tabs
            defaultValue="all"
            className="w-full sm:w-auto"
            onValueChange={setStatusFilter}
            value={statusFilter}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Newest first</SelectItem>
              <SelectItem value="created_asc">Oldest first</SelectItem>
              <SelectItem value="expires_desc">Expires latest</SelectItem>
              <SelectItem value="expires_asc">Expires soonest</SelectItem>
              <SelectItem value="original_az">Original URL (A-Z)</SelectItem>
              <SelectItem value="original_za">Original URL (Z-A)</SelectItem>
              <SelectItem value="clicks_desc">Most clicks</SelectItem>
              <SelectItem value="clicks_asc">Fewest clicks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <UrlTable urls={sortedUrls} />
    </div>
  );
}
