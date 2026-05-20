import './globals.css';
import type { Metadata } from "next";
import { Noto_Sans_JP } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConditionalNavbar from '@/components/conditionalNavbar';
import ConditionalFooter from '@/components/conditionalFooter';
import ConditionalCopyright from '@/components/conditionalCopyright';
import { AuthProvider } from "@/context/AuthContext";



export const metadata: Metadata = {
  title: "Bem-Vindos ao Projeto Tampets",
  description: "Venha conhecer um pouco sobre nós e fazer parte desse projeto incrivel!",
};

// Configuração da fonte
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSansJp.className}>
        <AuthProvider >
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
        <ConditionalCopyright />
        </AuthProvider>
      </body>
    </html>
  );
}
