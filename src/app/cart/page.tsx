import { redirect } from "next/navigation";

// The cart itself is the side drawer; the old /cart URL now points to checkout.
export default function CartRedirect() {
  redirect("/checkout");
}
