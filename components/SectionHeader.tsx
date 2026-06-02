import Link from "next/link";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleItalic?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  centered?: boolean;
  dark?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleItalic,
  description,
  viewAllHref,
  viewAllLabel = "Ver todo",
  centered = false,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 ${centered ? "items-center text-center" : ""}`}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
          {eyebrow}
        </span>
      )}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h2
          className={`text-3xl md:text-4xl font-bold leading-tight tracking-tight ${dark ? "text-white" : "text-[#1a1a1a]"}`}
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {title}{" "}
          {titleItalic && (
            <em className="text-[#F5A623] not-italic font-light">{titleItalic}</em>
          )}
        </h2>
        {viewAllHref && !centered && (
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-[#F5A623] hover:text-[#E08B00] transition-colors shrink-0"
          >
            {viewAllLabel} →
          </Link>
        )}
      </div>
      {description && (
        <p className={`text-base leading-relaxed max-w-xl ${dark ? "text-white/70" : "text-[#374151]"}`}>{description}</p>
      )}
      {viewAllHref && centered && (
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-[#F5A623] hover:text-[#E08B00] transition-colors mt-1"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
