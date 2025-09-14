import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (
      !name ||
      !email ||
      !/.+@.+\..+/.test(String(email)) ||
      !message ||
      String(message).trim().length < 10
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // TODO: send email using your provider of choice.
    // Example placeholder:
    console.log("[CONTACT]", { name, email, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
