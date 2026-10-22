import type { Metadata } from "next";
import { Dela_Gothic_One, IBM_Plex_Mono, Outfit } from "next/font/google";
import { Frame } from "@/components/Frame";
import { Providers } from "@/components/Providers";
import { LANG_KEY, PRO_KEY, THEME_KEY } from "@/lib/storage";
import "./globals.css";

const display = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const boot = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t==="white"||t==="silver"||t==="black")document.documentElement.setAttribute("data-theme",t);var l=localStorage.getItem(${JSON.stringify(LANG_KEY)});if(l==="zh"||l==="en")document.documentElement.lang=l;var p=localStorage.getItem(${JSON.stringify(PRO_KEY)});if(p&&p!=="0"&&p!=="false")document.documentElement.setAttribute("data-pro","on");}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://office-co.vercel.app"),
  title: {
    default: "office-co",
    template: "%s · office-co",
  },
  description: "Bilingual office micro-tools. Proprietary. All rights reserved.",
  applicationName: "office-co",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="silver" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <Providers>
          <Frame>{children}</Frame>
        </Providers>
      </body>
    </html>
  );
}
