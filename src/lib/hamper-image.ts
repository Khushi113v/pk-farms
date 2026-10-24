import fs from "fs";
import path from "path";
import { HAMPER_IMG } from "@/lib/hamper-data";
import { getProductBySlug } from "@/lib/product-data";

// Server only: the hamper photo if it has been added, otherwise the first product's photo
export function hamperImage(slug: string, firstItem: string) {
  const src = HAMPER_IMG(slug);
  if (fs.existsSync(path.join(process.cwd(), "public", src))) return src;
  return getProductBySlug(firstItem)?.image ?? "/images/products/ghee.png";
}
