import type { Metadata } from "next";
import { ProView } from "@/components/ProView";

export const metadata: Metadata = {
  title: "Pro",
  description: "Unlock office-co Pro on this device with a license key.",
};

export default function Page() {
  return <ProView />;
}
