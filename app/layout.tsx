import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ReplyKit — replies that sound like you",
    template: "%s · ReplyKit",
  },
  description:
    "Turn customer reviews into thoughtful, on-brand replies in seconds. Made for independent businesses.",
  applicationName: "ReplyKit",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
