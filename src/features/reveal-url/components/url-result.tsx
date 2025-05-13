"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Check, Copy } from "lucide-react";
import Link from "next/link";

interface UrlResultProps {
  originalUrl: string;
  shortCode: string;
}

export default function UrlResult({ originalUrl, shortCode }: UrlResultProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(originalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to truncate long URLs for display
  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle>Original URL Found</CardTitle>
        <CardDescription>
          The shortened code <span className="font-medium">{shortCode}</span>{" "}
          redirects to:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-3 rounded-md break-all mb-4 dark:bg-gray-800">
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            {truncateUrl(originalUrl)}
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </>
            )}
          </Button>

          <Button className="flex-1" asChild>
            <Link href={originalUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
