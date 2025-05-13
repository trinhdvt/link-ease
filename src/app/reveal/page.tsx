import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UrlRevealForm from "@/features/reveal-url/components/url-reveal-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Link Ease - Reveal URL",
  description: "Reveal the original destination of shortened URLs",
};

export default function RevealPage() {
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <div className="mx-auto">
        <Card className="border-none shadow-none md:bg-card bg-transparent">
          <CardHeader>
            <CardTitle className="text-center">Reveal URL</CardTitle>
            <CardDescription className="text-center">
              Enter a shortened URL to reveal its original destination
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UrlRevealForm />
          </CardContent>
          <CardFooter>
            <p>
              Want to create your own shortened URLs?{" "}
              <Link
                href="/"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Get started here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
