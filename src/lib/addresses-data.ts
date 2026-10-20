export type Address = {
  id: string;
  label: string;
  isDefault: boolean;
  type?: "billing" | "shipping"; // what the address is used for; unset = either
  name: string;
  line1: string; // house / flat no., building
  line2: string; // locality / area
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export const SEED_ADDRESSES: Address[] = [
  {
    id: "home",
    label: "Home",
    type: "billing",
    isDefault: true,
    name: "Jane Doe",
    line1: "112, Palm Residency, 4th Cross",
    line2: "Indiranagar",
    landmark: "Near CMH Hospital",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    phone: "+91 98765 43210",
  },
  {
    id: "work",
    label: "Work",
    type: "shipping",
    isDefault: false,
    name: "Jane Doe",
    line1: "PK Farms Pvt. Ltd., 3rd Floor",
    line2: "Outer Ring Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    phone: "+91 98765 43210",
  },
  {
    id: "office",
    label: "Work",
    type: "billing",
    isDefault: false,
    name: "Jane Doe",
    line1: "PK Farms Studio, 2nd Floor, MG Road",
    line2: "Camp",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    phone: "+91 98765 43210",
  },
  {
    id: "parents",
    label: "Other",
    type: "shipping",
    isDefault: false,
    name: "Jane Doe",
    line1: "45, Green Park Colony",
    line2: "Sector 9",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302020",
    phone: "+91 98765 43210",
  },
];
