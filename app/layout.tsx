import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Set NEXT_PUBLIC_SITE_URL to the deployed origin (e.g. on Vercel) so OG image
// URLs resolve absolutely; falls back to a placeholder for local builds.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mac-portfolio.vercel.app";
const title = "Christopher Angoe — Portfolio";
const description =
  "An interactive macOS desktop portfolio — open the apps in the dock, drag the windows, and poke at the Terminal.";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    type: "website",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "macOS desktop portfolio" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#1b2a63",
};

// Applies the saved theme/accent/wallpaper before first paint to avoid a flash
// of the wrong theme. Mirrors the defaults in lib/uiStore.ts.
const themeInitScript = `(function(){try{
  var s=JSON.parse(localStorage.getItem('portfolio-ui')||'{}');
  var t=s.theme||'auto';
  var dark=t==='dark'||(t==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);
  var d=document.documentElement;
  if(dark)d.classList.add('dark');
  if(s.accent)d.style.setProperty('--accent',s.accent);
  if(s.wallpaper)d.style.setProperty('--wallpaper',s.wallpaper);
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
