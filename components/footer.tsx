import Link from "next/link";
import BrandLogo from "@/components/brand-logo";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <Link className="brand" href="/">
        <BrandLogo size={26} />
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
