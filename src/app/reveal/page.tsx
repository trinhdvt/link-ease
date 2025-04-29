import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RevealPage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Reveal Shortened URL</CardTitle>
          <CardDescription>
            Enter a shortened URL to reveal its original destination
          </CardDescription>
        </CardHeader>
        <CardContent>{/* Form will be added here */}</CardContent>
      </Card>
    </div>
  );
}
