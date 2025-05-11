import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md w-full">
        <Loader2
          className="h-12 w-12 animate-spin text-primary mx-auto mb-4"
          data-testid="loading-spinner"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Redirecting you
        </h1>
        <p className="text-gray-600">
          Please wait while we redirect you to your destination...
        </p>
      </div>
    </div>
  );
}
