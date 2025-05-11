import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md w-full">
        <AlertTriangle
          className="h-12 w-12 text-red-500 mx-auto mb-4"
          data-testid="alert-icon"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Link Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The shortened URL you're trying to access doesn't exist or has
          expired.
        </p>
        <Link
          href="/"
          replace={true}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
