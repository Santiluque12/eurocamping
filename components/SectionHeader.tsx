import Link from "next/link";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleItalic?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  centered?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  titleItalic,
  description,
  viewAllHref,
  viewAllLabel = "Ver todo",
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 ${centered ? "items-center text-center" : ""}`}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-widest uppercase text-[#1D9E75]">
          {eyebrow}
        </span>
      )}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {title}{" "}
          {titleItalic && (
            <em className="text-[#1D9E75] not-italic font-light">{titleItalic}</em>
          )}
        </h2>
        {viewAllHref && !centered && (
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-[#1D9E75] hover:text-[#0F6E56] transition-colors shrink-0"
          >
            {viewAllLabel} →
          </Link>
        )}
      </div>
      {description && (
        <p className="text-[#374151] text-base leading-relaxed max-w-xl">{description}</p>
      )}
      {viewAllHref && centered && (
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-[#1D9E75] hover:text-[#0F6E56] transition-colors mt-1"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
