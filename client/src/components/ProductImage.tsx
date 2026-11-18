import { useEffect, useState, type CSSProperties } from "react";
import { IMAGE_PLACEHOLDER } from "../lib/utils";

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

function resolveSrc(src: string) {
  if (!src) return IMAGE_PLACEHOLDER;
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  if ((src.startsWith("/uploads") || src.startsWith("/api/uploads")) && API_BASE) {
    return `${API_BASE}${src}`;
  }
  return src;
}

type Props = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
};

export function ProductImage({
  src,
  alt,
  className,
  style,
  width,
  height,
  loading = "lazy",
}: Props) {
  const resolved = resolveSrc(src);
  const [current, setCurrent] = useState(resolved || IMAGE_PLACEHOLDER);

  useEffect(() => {
    setCurrent(resolveSrc(src) || IMAGE_PLACEHOLDER);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      style={style}
      onError={() => {
        if (current !== IMAGE_PLACEHOLDER) setCurrent(IMAGE_PLACEHOLDER);
      }}
    />
  );
}
