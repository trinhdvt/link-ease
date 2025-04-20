"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase"; // Import Firebase auth

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const { toast } = useToast();

  const handleShortenUrl = async () => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Get ID token if user is signed in
      if (auth.currentUser) {
        try {
          const idToken = await auth.currentUser.getIdToken();
          headers["Authorization"] = `Bearer ${idToken}`;
        } catch (error) {
          console.error("Error getting ID token:", error);
          // Decide how to handle token error - maybe notify user or proceed without auth?
          // For now, we'll proceed without the auth header
        }
      }

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: headers, // Use the updated headers object
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const data = await response.json();
      setShortenedUrl(data.shortenedUrl);
      toast({
        title: "URL Shortened!",
        description: "The URL has been shortened successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleCopyShortenedUrl = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast({
      description: "Shortened URL copied to clipboard",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">
        LinkEase - Shorten Your URLs
      </h1>
      <div className="w-full max-w-md space-y-4">
        <Input
          type="url"
          placeholder="Paste your URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          onClick={handleShortenUrl}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Shorten
        </Button>
        {shortenedUrl && (
          <div className="flex items-center justify-between p-4 rounded-md bg-accent/50">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {shortenedUrl}
            </a>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyShortenedUrl}
              aria-label="Copy result"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
