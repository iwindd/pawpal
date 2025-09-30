import { Sarabun } from "next/font/google";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export default sarabun;
