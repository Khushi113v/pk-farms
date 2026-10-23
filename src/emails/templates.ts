
import { C, fonts, inr, wrap, button, heading, paragraph, codeBox, divider, spacer, itemRows, SITE_URL, type EmailItem } from "./layout";

// ─── 1. Login code ────────────────────────────────────────────────────────────
export function loginEmail(d: { name: string; otp: string; minutes?: number }) {
  const minutes = d.minutes ?? 10;
  return {
    subject: `${d.otp} is your PK Farms login code`,
    html: wrap({
      title: "Your PK Farms login code",
      preheader: `Use ${d.otp} to sign in. It expires in ${minutes} minutes.`,
      body: `${heading("Your login code")}
        ${paragraph(`Hello ${d.name}, use this code to sign in to your PK Farms account.`)}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:24px auto 0;">
          <tr><td align="center" style="padding:16px 34px;border-radius:12px;background:${C.blush};border:1px solid ${C.line};">
            <span style="font-family:${fonts.sans};font-size:34px;font-weight:700;letter-spacing:0.35em;color:${C.maroon};">${d.otp}</span>
          </td></tr></table>
        <p style="margin:12px 0 0;font-family:${fonts.sans};font-size:13px;color:${C.muted};text-align:center;">This code expires in ${minutes} minutes.</p>
        ${divider()}
        <p style="margin:18px 0 0;font-family:${fonts.sans};font-size:12px;line-height:1.7;color:${C.muted};text-align:center;">
          Never share this code with anyone. PK Farms will never ask you for it.<br />
          If you did not try to sign in, you can safely ignore this email.
        </p>`,
    }),
  };
}

// ─── 2. Welcome / register ────────────────────────────────────────────────────
export function registerEmail(d: { name: string; code?: string }) {
  const code = d.code ?? "WELCOME10";
  const perk = (title: string, text: string) => `<tr><td style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${fonts.sans};">
      <div style="font-family:${fonts.serif};font-size:16px;color:${C.ink};">${title}</div>
      <div style="margin-top:3px;font-size:13px;line-height:1.6;color:${C.muted};">${text}</div></td></tr>`;
  return {
    subject: `Welcome to PK Farms, ${d.name}`,
    html: wrap({
      title: "Welcome to PK Farms",
      preheader: "Your account is ready. Here is 10% off your first order.",
      body: `${heading(`Welcome, ${d.name}`)}
        ${paragraph("Your PK Farms account is ready. We are so happy to have you with us. Here is a little gift to begin.")}
        ${codeBox(code, "Flat 10% off your first order")}
        ${spacer(26)}
        ${button("Start shopping", "/shop")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;border-top:1px solid ${C.line};">
          ${perk("Ghee, honey, oils and spices", "Bilona ghee, raw honey, wood pressed oil and pure heeng.")}
          ${perk("Natural, no preservatives", "Every product is 100% natural with nothing added.")}
          ${perk("Birthday and anniversary gifts", `Add your dates in <a href="${SITE_URL}/my-account" style="color:${C.maroon};">My Profile</a> and we will send you 15% off.`)}
        </table>`,
    }),
  };
}

// ─── 3. Order confirmation ────────────────────────────────────────────────────
export type OrderEmailData = {
  name: string;
  orderId: string;
  date: string;
  items: EmailItem[];
  subtotal: number;
  discount?: number;
  coupon?: string;
  giftWrap?: number;
  codFee?: number;
  shipping?: number; // 0 = free
  total: number;
  paymentMethod: string;
  billing: { name: string; lines: string };
  shippingTo: { name: string; lines: string };
};

export function orderEmail(d: OrderEmailData) {
  const row = (label: string, value: string, color: string = C.ink) =>
    `<tr><td style="padding:5px 0;font-family:${fonts.sans};font-size:14px;color:${C.muted};">${label}</td><td align="right" style="padding:5px 0;font-family:${fonts.sans};font-size:14px;color:${color};">${value}</td></tr>`;
  const addr = (title: string, a: { name: string; lines: string }) => `<td width="50%" valign="top" style="padding:0 8px 0 0;font-family:${fonts.sans};">
      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.goldText};">${title}</div>
      <div style="margin-top:6px;font-size:14px;color:${C.ink};">${a.name}</div>
      <div style="margin-top:2px;font-size:13px;line-height:1.6;color:${C.muted};">${a.lines}</div></td>`;
  return {
    subject: `Order confirmed: #${d.orderId}`,
    html: wrap({
      title: "Your PK Farms order",
      preheader: `Thank you ${d.name}. We have received your order #${d.orderId}.`,
      body: `${heading("Thank you for your order")}
        ${paragraph(`Hello ${d.name}, your order has been placed. We will email you the tracking link as soon as it ships.`)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;background:${C.ivory};border:1px solid ${C.line};border-radius:10px;">
          <tr>
            <td style="padding:12px 16px;font-family:${fonts.sans};font-size:13px;color:${C.muted};">Order ID<br /><span style="font-size:15px;font-weight:700;color:${C.ink};">#${d.orderId}</span></td>
            <td align="right" style="padding:12px 16px;font-family:${fonts.sans};font-size:13px;color:${C.muted};">Placed on<br /><span style="font-size:15px;font-weight:700;color:${C.ink};">${d.date}</span></td>
          </tr></table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">${itemRows(d.items)}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
          ${row("Subtotal", inr(d.subtotal))}
          ${d.discount ? row(`Discount${d.coupon ? ` (${d.coupon})` : ""}`, `−${inr(d.discount)}`, "#059669") : ""}
          ${d.giftWrap ? row("Gift wrap", inr(d.giftWrap)) : ""}
          ${d.codFee ? row("Cash on Delivery fee", inr(d.codFee)) : ""}
          ${row("Shipping", d.shipping ? inr(d.shipping) : "Free", d.shipping ? C.ink : "#059669")}
          <tr><td colspan="2" style="padding-top:8px;border-bottom:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:12px 0 0;font-family:${fonts.serif};font-size:18px;color:${C.ink};">Total</td>
              <td align="right" style="padding:12px 0 0;font-family:${fonts.serif};font-size:22px;color:${C.maroon};">${inr(d.total)}</td></tr>
          <tr><td colspan="2" style="padding-top:4px;font-family:${fonts.sans};font-size:12px;color:${C.muted};">Payment: ${d.paymentMethod}</td></tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-top:1px solid ${C.line};">
          <tr><td colspan="2" style="font-size:0;line-height:20px;">&nbsp;</td></tr>
          <tr>${addr("Billing address", d.billing)}${addr("Shipping address", d.shippingTo)}</tr></table>
        ${spacer(28)}
        ${button("Track my order", "/my-orders")}
        <p style="margin:22px 0 0;font-family:${fonts.sans};font-size:12px;line-height:1.7;color:${C.muted};text-align:center;">
          You can cancel before your order ships, or request a return within 7 days of delivery. See our
          <a href="${SITE_URL}/shipping-returns" style="color:${C.maroon};">Shipping &amp; Return Policy</a>.
        </p>`,
    }),
  };
}

// ─── 4. Cart reminder with extra 5% off ───────────────────────────────────────
export function cartReminderEmail(d: { name: string; items: EmailItem[]; code?: string; percent?: number }) {
  const code = d.code ?? "CART5";
  const percent = d.percent ?? 5;
  const subtotal = d.items.reduce((t, i) => t + i.price * i.qty, 0);
  const youPay = Math.round(subtotal * (1 - percent / 100));
  return {
    subject: `${d.name}, your cart is waiting (extra ${percent}% off)`,
    html: wrap({
      title: "Your cart is waiting",
      preheader: `Complete your order today and get an extra ${percent}% off.`,
      body: `${heading("You left something beautiful behind")}
        ${paragraph(`Hello ${d.name}, the items you picked are still in your cart. Shop now and we will take an extra <strong style="color:${C.maroon};">${percent}% off</strong>.`)}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;border-top:1px solid ${C.line};">${itemRows(d.items)}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
          <tr><td style="padding:5px 0;font-family:${fonts.sans};font-size:14px;color:${C.muted};">Cart total</td>
              <td align="right" style="padding:5px 0;font-family:${fonts.sans};font-size:14px;color:${C.muted};text-decoration:line-through;">${inr(subtotal)}</td></tr>
          <tr><td style="padding:5px 0;font-family:${fonts.sans};font-size:14px;color:${C.muted};">Extra ${percent}% off</td>
              <td align="right" style="padding:5px 0;font-family:${fonts.sans};font-size:14px;color:#059669;">−${inr(subtotal - youPay)}</td></tr>
          <tr><td style="padding:10px 0 0;font-family:${fonts.serif};font-size:18px;color:${C.ink};">You pay</td>
              <td align="right" style="padding:10px 0 0;font-family:${fonts.serif};font-size:22px;color:${C.maroon};">${inr(youPay)}</td></tr>
        </table>
        ${codeBox(code, `Apply this code at checkout for an extra ${percent}% off`)}
        ${spacer(24)}
        ${button("Complete my order", "/checkout")}
        <p style="margin:18px 0 0;font-family:${fonts.sans};font-size:12px;color:${C.muted};text-align:center;">Free shipping on orders above ₹999. Fresh, sealed packs.</p>`,
    }),
  };
}

// ─── Sample data for the preview page ─────────────────────────────────────────
export const SAMPLE_ITEMS: EmailItem[] = [
  { name: "Raw Honey", variant: "Pack of 1", qty: 1, price: 649, mrp: 749, image: "/images/products/honey.png" },
  { name: "Pure Desi Cow Ghee", variant: "Pack of 1", qty: 1, price: 1199, mrp: 1399, image: "/images/products/ghee.png" },
];

export const TEMPLATES = [
  { id: "login", label: "Login code", build: () => loginEmail({ name: "Priya", otp: "482916" }) },
  { id: "register", label: "Welcome", build: () => registerEmail({ name: "Priya" }) },
  {
    id: "order",
    label: "Order confirmation",
    build: () =>
      orderEmail({
        name: "Priya",
        orderId: "PKF48201937",
        date: "19 Oct 2026",
        items: SAMPLE_ITEMS,
        subtotal: 1848,
        discount: 185,
        coupon: "WELCOME10",
        giftWrap: 99,
        shipping: 0,
        total: 1762,
        paymentMethod: "Paid online",
        billing: { name: "Priya Sharma", lines: "112, Palm Residency, 4th Cross, Indiranagar<br />Bengaluru, Karnataka – 560038" },
        shippingTo: { name: "Priya Sharma", lines: "PK Farms Studio, 2nd Floor, MG Road<br />Pune, Maharashtra – 411001" },
      }),
  },
  { id: "cart", label: "Cart reminder", build: () => cartReminderEmail({ name: "Priya", items: SAMPLE_ITEMS }) },
];
