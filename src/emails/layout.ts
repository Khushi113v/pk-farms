
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const C = {
  maroon: "#0B5B36",
  ink: "#1F2D24",
  muted: "#6B7566",
  goldText: "#8A6420",
  blush: "#E7F0E4",
  ivory: "#FBF8F1",
  page: "#F4EDDA",
  line: "#E6E0CC",
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const fonts = { serif: SERIF, sans: SANS };

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
// Images and links in an email must be full web addresses
export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

export function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr><td align="center" bgcolor="${C.maroon}" style="border-radius:999px;">
      <a href="${abs(href)}" style="display:inline-block;padding:14px 34px;font-family:${SANS};font-size:14px;font-weight:600;letter-spacing:0.04em;color:#ffffff;text-decoration:none;border-radius:999px;">${label}</a>
    </td></tr></table>`;
}

export function heading(text: string) {
  return `<h1 style="margin:0;font-family:${SERIF};font-size:28px;line-height:1.25;font-weight:normal;color:${C.ink};text-align:center;">${text}</h1>`;
}

export function paragraph(text: string) {
  return `<p style="margin:14px 0 0;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.muted};text-align:center;">${text}</p>`;
}

export function codeBox(code: string, caption?: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:22px auto 0;">
    <tr><td align="center" style="padding:14px 30px;border:1px dashed ${C.maroon};border-radius:10px;background:${C.blush};">
      <span style="font-family:${SANS};font-size:20px;font-weight:700;letter-spacing:0.18em;color:${C.maroon};">${code}</span>
    </td></tr></table>${caption ? `<p style="margin:8px 0 0;font-family:${SANS};font-size:12px;color:${C.muted};text-align:center;">${caption}</p>` : ""}`;
}

export function divider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:26px 0 0;border-bottom:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

export function spacer(px: number) {
  return `<div style="height:${px}px;line-height:${px}px;font-size:0;">&nbsp;</div>`;
}

export type EmailItem = { name: string; variant?: string; qty: number; price: number; mrp?: number; image: string };

export function itemRows(items: EmailItem[]) {
  return items
    .map(
      (i) => `<tr>
      <td width="76" valign="top" style="padding:14px 0;border-bottom:1px solid ${C.line};">
        <img src="${abs(i.image)}" width="64" height="80" alt="${i.name}" style="display:block;width:64px;height:80px;object-fit:cover;object-position:top;border-radius:8px;border:1px solid ${C.line};" />
      </td>
      <td valign="top" style="padding:14px 12px;border-bottom:1px solid ${C.line};font-family:${SANS};">
        <div style="font-family:${SERIF};font-size:16px;color:${C.ink};line-height:1.3;">${i.name}</div>
        ${i.variant ? `<div style="margin-top:3px;font-size:12px;color:${C.muted};">${i.variant}</div>` : ""}
        <div style="margin-top:3px;font-size:12px;color:${C.muted};">Qty ${i.qty}</div>
      </td>
      <td align="right" valign="top" style="padding:14px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:14px;font-weight:600;color:${C.ink};white-space:nowrap;">
        ${inr(i.price * i.qty)}
        ${i.mrp && i.mrp > i.price ? `<div style="margin-top:2px;font-size:11px;font-weight:normal;color:${C.muted};text-decoration:line-through;">${inr(i.mrp * i.qty)}</div>` : ""}
      </td>
    </tr>`
    )
    .join("");
}

// Wraps the body of a mail in the common header and footer
export function wrap({ title, preheader, body }: { title: string; preheader: string; body: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;border:1px solid ${C.line};">
    <tr><td align="center" style="padding:30px 24px 22px;background:${C.ivory};border-radius:16px 16px 0 0;border-bottom:1px solid ${C.line};">
      <a href="${SITE_URL}" style="text-decoration:none;"><img src="${abs("/images/logos/pk-farms-logo.png")}" width="110" alt="PK Farms" style="display:block;width:110px;max-width:60%;height:auto;margin:0 auto;" /></a>
    </td></tr>
    <tr><td style="padding:34px 32px 36px;">${body}</td></tr>
    <tr><td align="center" style="padding:24px 28px 28px;background:${C.ivory};border-radius:0 0 16px 16px;border-top:1px solid ${C.line};font-family:${SANS};">
      <div style="font-family:${SERIF};font-size:13px;letter-spacing:0.14em;color:${C.goldText};text-transform:uppercase;">Pure pahadi food. Straight from the hills.</div>
      <p style="margin:12px 0 0;font-size:12px;line-height:1.7;color:${C.muted};">
        <a href="${SITE_URL}/shop" style="color:${C.maroon};text-decoration:none;">Shop</a> &nbsp;·&nbsp;
        <a href="${SITE_URL}/my-orders" style="color:${C.maroon};text-decoration:none;">My orders</a> &nbsp;·&nbsp;
        <a href="${SITE_URL}/faq" style="color:${C.maroon};text-decoration:none;">FAQs</a> &nbsp;·&nbsp;
        <a href="${SITE_URL}/contact-us" style="color:${C.maroon};text-decoration:none;">Contact</a>
      </p>
      <p style="margin:12px 0 0;font-size:11px;line-height:1.7;color:${C.muted};">
        Need help? Write to <a href="mailto:hello@pkfarms.in" style="color:${C.maroon};">hello@pkfarms.in</a> or call +91 98765 43210.<br />
        #377 Ward No. 9, Ekta Nagri, Mandi Dabwali, Haryana 125104
      </p>
      <p style="margin:12px 0 0;font-size:11px;color:#9AA396;">&copy; ${new Date().getFullYear()} PK Farms. All rights reserved.</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
