import "./globals.css";

export const metadata = {
  title: "AI SURVIVOR $",
  description: "Your intelligent business platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
