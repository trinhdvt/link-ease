import UrlShortenForm from "@/features/url-shorten/components/url-shorten-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Ease - Shorten Your URLs",
  description: "Shorten your URLs with Link Ease",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <h1 className="text-2xl font-semibold mb-6 text-foreground dark:text-foreground">
        LinkEase - Shorten Your URLs
      </h1>
      <div className="w-full max-w-md">
        <UrlShortenForm />
      </div>
    </div>
  );
}
