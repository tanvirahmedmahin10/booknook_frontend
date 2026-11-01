import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ImgBB API key is missing on the server." },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const imgbbForm = new FormData();
    imgbbForm.append("image", base64Image);

    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: imgbbForm,
      }
    );

    const data = await imgbbResponse.json();

    if (!imgbbResponse.ok || !data.data?.url) {
      return NextResponse.json(
        { error: data?.error?.message || "ImgBB upload failed." },
        { status: imgbbResponse.status || 500 }
      );
    }

    return NextResponse.json({ url: data.data.url });
  } catch (error) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Internal Server Error" },
    { status: 500 }
  );
}
}