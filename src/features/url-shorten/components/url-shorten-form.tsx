"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export default function UrlShortenForm() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleShortenUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    startTransition(async () => {
      try {
        const response = await fetch("/api/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    });
  };

  const handleCopyShortenedUrl = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast({
      description: "Shortened URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleShortenUrl} className="space-y-4">
        <Input
          type="url"
          placeholder="Paste your URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isPending}
        />
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isPending || !url}
        >
          {isPending ? (
            <>
              Shortening
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Shorten"
          )}
        </Button>
      </form>
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
  );
}
