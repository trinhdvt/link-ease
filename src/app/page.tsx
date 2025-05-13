import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UrlShortenForm from "@/features/url-shorten/components/url-shorten-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Ease - Shorten Your URLs",
  description: "Shorten your URLs with Link Ease",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <Card className="border-none shadow-none md:bg-card bg-transparent">
        <CardHeader>
          <CardTitle>LinkEase - Shorten Your URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <UrlShortenForm />
        </CardContent>
      </Card>
    </div>
  );
}
