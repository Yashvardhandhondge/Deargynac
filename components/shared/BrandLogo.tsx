import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Source image is 582×376 */
const LOGO_ASPECT = 582 / 376;

type BrandLogoProps = {
  href?: string | null;
  /** Logo height in px */
  height?: number;
  /** Shorthand for height (existing call sites) */
  size?: number;
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({
  href = "/",
  height,
  size,
  className,
  priority = false,
}: BrandLogoProps) {
  const h = height ?? size ?? 40;
  const w = Math.round(h * LOGO_ASPECT);

  const image = (
    <Image
      src="/logo.jpg"
      alt="DearGynac"
      width={w}
      height={h}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ width: w, height: h }}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97894] focus-visible:ring-offset-2"
        aria-label="DearGynac home"
      >
        {image}
      </Link>
    );
  }

  return image;
}
