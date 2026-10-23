"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Profile = {
  name: string;
  email: string;
  phone: string;
  dob: string; // yyyy-mm-dd
  anniversary: string; // yyyy-mm-dd
};

const EMPTY: Profile = { name: "Priya Sharma", email: "priya.sharma@example.com", phone: "", dob: "", anniversary: "" };

type ProfileContextValue = {
  profile: Profile;
  saveProfile: (p: Profile) => void;
  hydrated: boolean;
  // Id of the occasion banner the visitor closed (so it stays closed on every page)
  dismissedBanner: string;
  dismissBanner: (id: string) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);
const STORAGE_KEY = "pk-farms-profile";
const DISMISS_KEY = "pk-farms-banner-dismissed";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [dismissedBanner, setDismissed] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...EMPTY, ...JSON.parse(raw) });
      setDismissed(localStorage.getItem(DISMISS_KEY) ?? "");
    } catch {}
    setHydrated(true);
  }, []);

  const saveProfile = (p: Profile) => {
    setProfile(p);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
  };

  const dismissBanner = (id: string) => {
    setDismissed(id);
    try {
      localStorage.setItem(DISMISS_KEY, id);
    } catch {}
  };

  return (
    <ProfileContext.Provider value={{ profile, saveProfile, hydrated, dismissedBanner, dismissBanner }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
