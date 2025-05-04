import UrlDashboard from "@/features/url-dashboard/components/url-dashboard";
import { getCurrentUser } from "@/lib/auth";
import { getUserUrls } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "My URLs | Link Ease",
  description: "Manage all your shortened URLs in one place",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }
  const allUrls = await getUserUrls(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My URLs</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all your shortened URLs in one place
        </p>
      </div>

      <UrlDashboard urls={allUrls} />
    </div>
  );
}
