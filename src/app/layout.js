import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cassino Online Regulamentado do Brasil via Pix | Jogos de Cassino",
  description:
    "Cassino Online com emoção, Pix e melhores jogos autorizado no Brasil. A Cassino, é uma bet com bônus exclusivos, facilidade e saque rápido",
  generator: "LexLuthorDev",
  manifest: "/manifest.json",
  keywords: ["Next.js", "React", "JavaScript"],
  icons: {
    icon: [
      {
        url: "https://static.cassino.bet.br/deploy-8f8fa6a099114457c9876443c93854e56c697198-1e7cd70210fd8ebac51b/assets/favicon.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-zinc-900 flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
