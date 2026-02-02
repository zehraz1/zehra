import "./globals.css";
import { Quicksand } from "next/font/google";
import Container  from "./vsContainer/vs"; 

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${quicksand.variable} bg-bg`}>
      <body>
        {children}
        <Container />
      </body>
    </html>
  );
}
