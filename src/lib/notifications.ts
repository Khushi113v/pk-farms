import type { Profile } from "./profile-context";

export type Notification = {
  id: string;
  kind: "birthday" | "anniversary" | "offer" | "profile" | "order";
  title: string;
  text: string;
  code?: string;
  image: string;
  // Only the occasion gifts can show in the top banner
  banner?: boolean;
};

const DAY = 24 * 60 * 60 * 1000;

// Days to the date's occurrence this month (negative = already passed), or null when it is not in the current month
function daysInMonth(date: string, today: Date): number | null {
  const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
  if (!m || Number(m[1]) - 1 !== today.getMonth()) return null;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.round((new Date(today.getFullYear(), today.getMonth(), Number(m[2])).getTime() - start) / DAY);
}

export function getNotifications(profile: Profile, today = new Date()): Notification[] {
  const list: Notification[] = [];
  const name = profile.name.split(" ")[0] || "there";

  const bday = daysInMonth(profile.dob, today);
  if (bday !== null) {
    list.push({
      id: `birthday-${today.getFullYear()}`,
      kind: "birthday",
      image: "/images/products/ghee.png",
      title: `Happy Birthday, ${name}! You have received 15% off`,
      text: "A birthday gift from PK Farms is waiting for you. Use the code at checkout, valid all month long.",
      code: "BIRTHDAY15",
      banner: true,
    });
  }

  const anniv = daysInMonth(profile.anniversary, today);
  if (anniv !== null) {
    list.push({
      id: `anniversary-${today.getFullYear()}`,
      kind: "anniversary",
      image: "/images/products/honey.png",
      title: `Happy Anniversary, ${name}! You have received 15% off`,
      text: "An anniversary gift from PK Farms is waiting for you. Use the code at checkout, valid all month long.",
      code: "ANNIVERSARY15",
      banner: true,
    });
  }

  list.push(
    {
      id: "offer-welcome",
      kind: "offer",
      image: "/images/products/honey.png",
      title: "Flat 10% off your first order",
      text: "New to PK Farms? Use the code at checkout.",
      code: "WELCOME10",
    },
    {
      id: "offer-festive",
      kind: "offer",
      image: "/images/products/ghee.png",
      title: "₹100 off on orders above ₹1500",
      text: "A little treat for your next pantry refill.",
      code: "FESTIVE100",
    }
  );

  return list;
}
