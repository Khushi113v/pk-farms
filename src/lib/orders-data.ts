export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type OrderItem = {
  slug: string;
  name: string;
  variant: string;
  qty: number;
  price: number;
  image: string;
};

export type OrderAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export type Order = {
  id: string;
  date: string;
  arrivingBy?: string;
  status: OrderStatus;
  trackingId?: string;
  items: OrderItem[];
  discount: number;
  shippingFee: number;
  paymentMethod: string;
  paidOn: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
};

const ADDRESS = {
  name: "Jane Doe",
  line1: "112, Palm Residency, 4th Cross",
  line2: "Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
  phone: "+91 98765 43210",
};

export const ORDERS: Order[] = [
  {
    id: "WM-2026-0912",
    date: "05 Sep 2026",
    arrivingBy: "09 Sep 2026",
    status: "Delivered",
    items: [
      {
        slug: "pahadi-badri-cow-ghee",
        name: "Pahadi Badri Cow Ghee",
        variant: "500 g",
        qty: 1,
        price: 1099,
        image: "/images/products/ghee-badri-cow.svg",
      },
    ],
    discount: 0,
    shippingFee: 0,
    paymentMethod: "UPI · GPay",
    paidOn: "05 Sep 2026",
    shippingAddress: ADDRESS,
    billingAddress: ADDRESS,
  },
  {
    id: "WM-2026-0847",
    date: "28 Aug 2026",
    arrivingBy: "01 Sep 2026",
    status: "Shipped",
    trackingId: "BDX2098573421",
    items: [
      {
        slug: "wild-forest-honey",
        name: "Wild Forest Honey",
        variant: "250 g",
        qty: 1,
        price: 399,
        image: "/images/products/honey-forest.svg",
      },
      {
        slug: "multiflora-himalayan-honey",
        name: "Multiflora Himalayan Honey",
        variant: "500 g",
        qty: 1,
        price: 649,
        image: "/images/products/honey-multiflora.svg",
      },
    ],
    discount: 50,
    shippingFee: 0,
    paymentMethod: "UPI · GPay",
    paidOn: "28 Aug 2026",
    shippingAddress: ADDRESS,
    billingAddress: ADDRESS,
  },
  {
    id: "WM-2026-0781",
    date: "19 Aug 2026",
    arrivingBy: "23 Aug 2026",
    status: "Processing",
    items: [
      {
        slug: "lakadong-turmeric-powder",
        name: "Lakadong Turmeric Powder",
        variant: "200 g",
        qty: 1,
        price: 329,
        image: "/images/products/masala-turmeric.svg",
      },
    ],
    discount: 0,
    shippingFee: 0,
    paymentMethod: "Credit Card",
    paidOn: "19 Aug 2026",
    shippingAddress: ADDRESS,
    billingAddress: ADDRESS,
  },
  {
    id: "WM-2026-0664",
    date: "02 Aug 2026",
    status: "Cancelled",
    items: [
      {
        slug: "wild-forest-honey",
        name: "Wild Forest Honey",
        variant: "250 g",
        qty: 1,
        price: 399,
        image: "/images/products/honey-forest.svg",
      },
    ],
    discount: 0,
    shippingFee: 0,
    paymentMethod: "UPI · GPay",
    paidOn: "02 Aug 2026",
    shippingAddress: ADDRESS,
    billingAddress: ADDRESS,
  },
];

export function getOrderById(id: string) {
  return ORDERS.find((o) => o.id === id);
}

export function orderSubtotal(order: Order) {
  return order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function orderQty(order: Order) {
  return order.items.reduce((sum, i) => sum + i.qty, 0);
}
