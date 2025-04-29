"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { revealUrl } from "@/features/reveal-url/actions";
import UrlResult from "./url-result";

export default function UrlRevealForm() {
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      setError(null);
      setOriginalUrl(null);

      try {
        // Basic validation
        if (!inputUrl.trim()) {
          throw new Error("Please enter a URL");
        }

        // Extract short code if full URL is provided
        let code = inputUrl.trim();
        if (code.endsWith("/")) {
          code = code.slice(0, -1);
        }
        if (code.includes("/")) {
          const urlParts = code.split("/");
          code = urlParts[urlParts.length - 1];
        }

        setShortCode(code);

        const result = await revealUrl(code);

        if (result.error) {
          throw new Error(result.error);
        }

        setOriginalUrl(result.originalUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reveal URL");
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Shortened URL or Code
          </label>
          <div className="mt-2">
            <Input
              id="url"
              name="url"
              type="text"
              placeholder="e.g., https://linkease.com/abc123 or abc123"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full"
              disabled={isPending}
              autoComplete="off"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !inputUrl.trim()}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Revealing URL...
            </>
          ) : (
            "Reveal Original URL"
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {originalUrl && shortCode && (
        <UrlResult originalUrl={originalUrl} shortCode={shortCode} />
      )}
    </div>
  );
}
