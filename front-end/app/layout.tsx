import './globals.css';
import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import ConditionalNavbar from '@/components/conditionalNavbar';
import ConditionalFooter from '@/components/conditionalFooter';
import ConditionalCopyright from '@/components/conditionalCopyright';
import { AuthProvider } from "@/context/AuthContext";



export const metadata: Metadata = {
  title: "Bem-Vindos ao Projeto Tampets",
  description: "Venha conhecer um pouco sobre nós e fazer parte desse projeto incrivel!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
