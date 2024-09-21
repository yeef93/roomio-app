import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import MenuProvider from "@/context/MenuProvider";
import { Layout } from "@/components/Layout";
import { Suspense } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Add other weights if needed
  display: "swap", // Optional: improves loading performance
});

export const metadata: Metadata = {
  title: "Roomio | Room with a view, wherever you go.",
  description: "Room with a view, wherever you go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Layout>
          <MenuProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <main className="m-0 p-0">{children}</main>
            </Suspense>
          </MenuProvider>
        </Layout>
      </body>
    </html>
  );
}
