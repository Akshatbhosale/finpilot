import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "FinPilot",
  description: "Fintech strategy dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100 dark:bg-[#0b0b0b]">
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
