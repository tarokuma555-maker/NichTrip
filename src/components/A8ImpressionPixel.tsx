/* eslint-disable @next/next/no-img-element */
export default function A8ImpressionPixel({ url }: { url: string }) {
  return (
    <img
      src={url}
      width={1}
      height={1}
      alt=""
      style={{ position: "absolute", visibility: "hidden", pointerEvents: "none" }}
    />
  );
}
