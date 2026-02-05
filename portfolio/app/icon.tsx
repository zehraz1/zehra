import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          color: "white",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #FFD84D, #FF4DA6)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Z
      </div>
    ),
    { ...size }
  );
}
