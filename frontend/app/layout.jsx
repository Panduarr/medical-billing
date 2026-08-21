import "./globals.css";

export const metadata = {
  title: "Medical Software Quotes",
  description: "Compare medical software quotes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
