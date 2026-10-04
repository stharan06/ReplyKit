import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <MessageCircle size={17} strokeWidth={2.4} />
        </span>
        <span>replykit</span>
      </Link>
      <span>ReplyKit - Thoughtful replies, less busywork.</span>
      <nav style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Link href="/pricing">Pricing</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <a href="mailto:tharannaidus1@gmail.com">Contact</a>
      </nav>
    </footer>
  );
}
