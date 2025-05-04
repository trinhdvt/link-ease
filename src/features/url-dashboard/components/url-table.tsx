"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clientConfig } from "@/lib/config";
import type { UrlData } from "@/lib/data";

import {
  BarChart2,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UrlTableProps {
  urls: UrlData[];
}

export default function UrlTable({ urls }: UrlTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(urls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUrls = urls.slice(startIndex, startIndex + itemsPerPage);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Function to truncate long URLs for display
  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  if (urls.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium">No URLs found</h3>
        <p className="text-muted-foreground mt-2">
          You haven't created any shortened URLs yet, or none match your current
          filters.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/">Create New URL</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Original URL</TableHead>
                <TableHead className="w-[20%]">Shortened URL</TableHead>
                <TableHead className="w-[15%]">Expiration</TableHead>
                <TableHead className="w-[10%] text-right">Clicks</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUrls.map((url) => {
                const isExpired = new Date(url.expiresAt) < new Date();

                return (
                  <TableRow key={url.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div
                          className="truncate max-w-[300px]"
                          title={url.originalUrl}
                        >
                          {truncateUrl(url.originalUrl, 40)}
                        </div>
                        <Link
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{`${clientConfig.domain}/${url.shortCode}`}</span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `${clientConfig.baseUrl}/${url.shortCode}`,
                              url.id,
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {copiedId === url.id ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={isExpired ? "destructive" : "outline"}
                            >
                              {isExpired ? "Expired" : "Active"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent hidden={!isExpired}>
                            This URL has expired and will be deleted soon.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(url.expiresAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {url.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Analytics"
                          disabled={true}
                        >
                          <BarChart2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete URL">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, urls.length)} of {urls.length}{" "}
            URLs
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
