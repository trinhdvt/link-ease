import type { Metadata } from "next";
import UrlRevealForm from "@/features/reveal-url/components/url-reveal-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Link Ease - Reveal URL",
  description: "Reveal the original destination of shortened URLs",
};

export default function RevealPage() {
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            Reveal URL
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            Enter a shortened URL to reveal its original destination
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-lg sm:px-10 dark:bg-gray-800 dark:shadow-md">
          <UrlRevealForm />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Want to create your own shortened URLs?{" "}
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Get started here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
