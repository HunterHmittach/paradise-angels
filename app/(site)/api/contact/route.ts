import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const send = await resend.emails.send({
      from: "Paradise Angels <no-reply@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL!,
      subject: `Nieuw bericht van ${name}`,
      html: `
        <h2>Nieuw contactbericht</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Bericht:</strong><br>${message}</p>
      `,
    });

    return NextResponse.json({ success: true, send });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
