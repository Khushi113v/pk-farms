import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BackToTop from "@/components/common/BackToTop";
import CartSidebar from "@/components/common/CartSidebar";
import { CartProvider } from "@/lib/cart-context";
import { AddressProvider } from "@/lib/address-context";
import { ProfileProvider } from "@/lib/profile-context";
import { WishlistProvider } from "@/lib/wishlist-context";

export const metadata: Metadata = {
  title: "PK Farms — Pure Pahadi Ghee, Honey & Masala",
  description:
    "Bilona ghee, raw Himalayan honey and stone-ground masalas, sourced directly from farmers and delivered to your door.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ProfileProvider>
        <AddressProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <BackToTop />
              <CartSidebar />
            </CartProvider>
          </WishlistProvider>
        </AddressProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
