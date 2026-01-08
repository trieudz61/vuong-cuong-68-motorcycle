import type { Metadata, Viewport } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/components/providers/TransitionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Vương Cường 68 - Xe Máy Cũ | Mua Bán & Cầm Đồ Uy Tín",
  description: "Vương Cường 68 - Chuyên mua bán xe máy cũ uy tín, dịch vụ cầm đồ xe máy nhanh chóng, lãi suất thấp. Honda, Yamaha, Suzuki giá tốt nhất.",
  keywords: "Vương Cường 68, xe máy cũ, mua bán xe máy, cầm đồ xe máy, Honda, Yamaha, Suzuki",
  authors: [{ name: "Vương Cường 68" }],
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${roboto.variable} font-sans antialiased`}
      >
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
