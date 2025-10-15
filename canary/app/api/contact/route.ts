import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, phone, email, message, qrUrl } = await req.json(); // QR: přijímáme qrUrl (volitelné)

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Neplatná data formuláře." },
        { status: 400 }
      );
    }

    // ---- SMTP z env proměnných ----
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER; // např. tanecnicentrummirror@gmail.com
    const pass = process.env.SMTP_PASS; // app heslo
    const to = process.env.SMTP_TO || user; // admin příjemce
    const fromAddress = process.env.SMTP_FROM || user; // envelope/From adresa
    const fromName = process.env.SMTP_FROM_NAME || "TC Mirror";
    const brand = process.env.SMTP_BRAND || "Taneční centrum Mirror";

    if (!user || !pass) {
      return NextResponse.json(
        { ok: false, error: "Chybí SMTP_USER nebo SMTP_PASS." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL
      auth: { user, pass },
    });

    // QR: stáhneme QR PNG, pokud dorazil qrUrl
    let qrAttachment: { filename: string; content: Buffer; contentType: string; cid?: string } | null = null;
    if (qrUrl && typeof qrUrl === "string") {
      try {
        const res = await fetch(qrUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`QR download failed: ${res.status}`);
        const ab = await res.arrayBuffer();
        qrAttachment = {
          filename: "platba-qr.png",
          content: Buffer.from(ab),
          contentType: "image/png",
          cid: "qrimg@mirror", // pro inline zobrazení v HTML
        };
      } catch (e) {
        console.warn("QR_FETCH_WARN", e);
      }
    }

    // ---------- 1) Mail ADMINOVI ----------
    const adminSubject = `Kontakt z webu – ${name}`;
    const adminText = `
Jméno: ${name}
Telefon: ${phone || "-"}
Email: ${email}

Zpráva:
${message}
`.trim();

    const adminHtml = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
        <h2>Nová zpráva z kontaktního / registračního formuláře</h2>
        <p><b>Jméno:</b> ${escapeHtml(name)}</p>
        <p><b>Telefon:</b> ${escapeHtml(phone || "-")}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Zpráva:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
        ${
          qrAttachment
            ? `<p><b>QR kód:</b><br/><img src="cid:qrimg@mirror" alt="QR kód" style="max-width:260px;border:1px solid #eee;border-radius:8px"/></p>`
            : ""
        }
      </div>
    `;

    const adminMail = transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      replyTo: email,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
      attachments: qrAttachment ? [qrAttachment] : undefined, // QR: příloha
    });

    // ---------- 2) Potvrzení KLIENTOVI ----------
    const clientSubject = `Potvrzení registrace – ${brand}`;
    const clientText = makeClientText({ brand, name, phone, email, message, hasQr: !!qrAttachment });
    const clientHtml = makeClientHtml({ brand, name, phone, email, message, includeQr: !!qrAttachment });

    const clientMail = transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: email,              // klient
      replyTo: fromAddress,   // ať odpoví na studio
      subject: clientSubject,
      text: clientText,
      html: clientHtml,
      attachments: qrAttachment ? [qrAttachment] : undefined, // QR: příloha
    });

    const results = await Promise.allSettled([adminMail, clientMail]);
    const adminOk = results[0].status === "fulfilled";
    const userOk = results[1].status === "fulfilled";

    if (!adminOk) {
      console.error("CONTACT_API_ERROR: admin mail failed", results[0]);
      return NextResponse.json(
        { ok: false, error: "Odeslání selhalo (admin mail)." },
        { status: 500 }
      );
    }

    if (!userOk) {
      console.warn("CONTACT_API_WARN: user confirmation failed", results[1]);
    }

    return NextResponse.json({ ok: true, userMail: userOk ? "sent" : "failed", attachedQr: !!qrAttachment });
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

function makeClientText({
  brand,
  name,
  phone,
  email,
  message,
  hasQr,
}: {
  brand: string;
  name: string;
  phone?: string;
  email: string;
  message: string;
  hasQr: boolean;
}) {
  return `
Dobrý den ${name},

děkujeme za vaši registraci / přihlášku do kurzu (${brand}).
Tento e-mail je potvrzení, že jsme ji úspěšně přijali.

Rekapitulace zadaných údajů:
- Jméno: ${name}
- Telefon: ${phone || "-"}
- E-mail: ${email}
- Zpráva / rekapitulace: 
${message}

${hasQr ? "QR kód pro platbu je přiložen jako obrázek." : ""}

U bezhotovostní platby vám platební údaje sdělí lektor na požádání před nebo po lekci.

Na viděnou na parketu!
${brand}
`.trim();
}

function makeClientHtml({
  brand,
  name,
  phone,
  email,
  message,
  includeQr,
}: {
  brand: string;
  name: string;
  phone?: string;
  email: string;
  message: string;
  includeQr: boolean;
}) {
  const esc = (s: string) => escapeHtml(s);
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
    <h2 style="margin:0 0 8px">Potvrzení registrace</h2>
    <p style="margin:0 0 16px">Dobrý den ${esc(name)},<br/>
    děkujeme za vaši registraci / přihlášku do kurzu <b>${esc(brand)}</b>.<br/>
    Tento e-mail potvrzuje, že jsme ji úspěšně přijali.</p>

    <h3 style="margin:16px 0 8px">Rekapitulace údajů</h3>
    <ul style="margin:0 0 16px;padding-left:18px">
      <li><b>Jméno:</b> ${esc(name)}</li>
      <li><b>Telefon:</b> ${esc(phone || "-")}</li>
      <li><b>E-mail:</b> ${esc(email)}</li>
    </ul>
    <p style="white-space:pre-wrap"><b>Zpráva / rekapitulace:</b><br/>${esc(message).replace(/\n/g, "<br/>")}</p>

    ${
      includeQr
        ? `<p style="margin:16px 0"><b>QR kód pro platbu:</b></p>
           <img src="cid:qrimg@mirror" alt="QR kód" style="max-width:260px;border:1px solid #eee;border-radius:8px" />`
        : ""
    }

    <p style="margin:16px 0">
      U bezhotovostní platby vám platební údaje sdělí lektor na požádání před nebo po lekci.
    </p>

    <p style="margin:16px 0 0">Na viděnou na parketu!<br/>${esc(brand)}</p>
  </div>
  `;
}
