import { getOriginalUrl } from "@/features/url-shorten/actions/get-original-url";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    shortCode: string;
  }>;
}

export async function GET(req: Request, { params }: Params) {
  const { shortCode } = await params;

  const originalUrl = await getOriginalUrl(shortCode, req.headers);
  if (!originalUrl) {
    return NextResponse.json(
      { error: "URL not found or expired" },
      { status: 404 },
    );
  }

  return NextResponse.json({ originalUrl }, { status: 200 });
}
