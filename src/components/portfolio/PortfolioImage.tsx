"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  lqip?: string | null;
  preload?: boolean;
  className?: string;
};

function isTrustedImageSource(src: string) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const imageUrl = new URL(src);
    if (imageUrl.protocol !== "https:") return false;
    if (imageUrl.hostname === "images.unsplash.com") return true;
    if (imageUrl.hostname.endsWith(".supabase.co") && imageUrl.pathname.startsWith("/storage/v1/object/public/")) return true;
    const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (configuredSupabaseUrl) {
      const projectUrl = new URL(configuredSupabaseUrl);
      return imageUrl.origin === projectUrl.origin && imageUrl.pathname.startsWith("/storage/v1/object/public/");
    }
  } catch {
    return false;
  }
  return false;
}

export function PortfolioImage({ src, alt, sizes, lqip, preload = false, className }: Props) {
  const [failure, setFailure] = useState<{ src: string; failed: boolean }>({ src: "", failed: false });
  const failed = failure.src === src && failure.failed;
  const valid = isTrustedImageSource(src);

  if (failed || !valid) {
    return <span className={`portfolio-image-fallback ${className ?? ""}`} role="img" aria-label={`${alt} — image unavailable`}><span className="mono">IMAGE UNAVAILABLE</span></span>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      loading={preload ? undefined : "lazy"}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip ?? undefined}
      className={className}
      onError={() => setFailure({ src, failed: true })}
    />
  );
}
