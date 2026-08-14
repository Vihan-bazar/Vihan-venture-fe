import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vihan Venture",
  description: "Vihan Venture - Premium Fashion for the Modern Individual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F3F2EC] text-[#111]">
        {/* Main content expands to fill available space */}
        <div className="flex-1 flex flex-col relative z-10">
          {children}
        </div>
        
        {/* Global Footer anchors to the bottom */}
        <Footer />
      </body>
    </html>
  );
}