import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Neplatná data formuláře." },
        { status: 400 }
      );
    }

    // SMTP config z env proměnných
    const host = process.env.SMTP_HOST as string;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER as string;
    const pass = process.env.SMTP_PASS as string;

    if (!host || !port || !user || !pass) {
      return NextResponse.json(
        { ok: false, error: "Chybí SMTP konfigurace na serveru." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL
      auth: { user, pass },
    });

    const to = process.env.SMTP_TO || "vasamariarich@gmail.com";
    const from = process.env.SMTP_FROM || user;

    const subject = `Kontakt z webu – ${name}`;
    const text = `
Jméno: ${name}
Telefon: ${phone || "-"}
Email: ${email}

Zpráva:
${message}
`.trim();

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
        <h2>Nová zpráva z kontaktního formuláře</h2>
        <p><b>Jméno:</b> ${escapeHtml(name)}</p>
        <p><b>Telefon:</b> ${escapeHtml(phone || "-")}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Zpráva:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CONTACT_API_ERROR", err);
    return NextResponse.json(
      { ok: false, error: "Odeslání selhalo." },
      { status: 500 }
    );
  }
}

// malá sanitizace HTML
function escapeHtml(str: string) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
