import Image from "next/image";

export default function BrandLogo({
  size = 32,
  style,
  className = "",
}: {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const radius = Math.round(size * 0.28);
  return (
    <span
      className={`brand-mark ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: radius,
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        padding: 0,
        ...style,
      }}
    >
      <Image
        src="/logo.png"
        alt="ReplyKit"
        width={size}
        height={size}
        priority
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: radius,
          display: "block",
        }}
      />
    </span>
  );
}
