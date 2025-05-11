import { getOriginalUrl } from "@/features/url-shorten/actions/get-original-url";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Redirecting... | LinkEase",
  description: "Redirecting to the original URL for the provided short code.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RedirectPage({
  params,
}: { params: Promise<{ shortCode: string }> }) {
  const [reqHeaders, { shortCode }] = await Promise.all([headers(), params]);

  const originalUrl = await getOriginalUrl(shortCode, reqHeaders);

  if (!originalUrl) {
    return notFound();
  }

  return redirect(originalUrl);
}
