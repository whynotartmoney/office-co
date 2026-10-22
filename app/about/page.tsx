import type { Metadata } from "next";
import { AboutView } from "@/components/AboutView";

export const metadata: Metadata = {
  title: "About",
  description: "office-co is proprietary bilingual office micro-tools. All rights reserved.",
};

export default function Page() {
  return <AboutView />;
}
