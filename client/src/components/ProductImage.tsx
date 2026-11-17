import { useEffect, useState, type CSSProperties } from "react";
import { IMAGE_PLACEHOLDER } from "../lib/utils";

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
  const [current, setCurrent] = useState(src || IMAGE_PLACEHOLDER);

  useEffect(() => {
    setCurrent(src || IMAGE_PLACEHOLDER);
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
