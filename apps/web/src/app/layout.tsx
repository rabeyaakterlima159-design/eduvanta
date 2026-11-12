import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'EDUVANTA - Smart Campus Management Ecosystem',
  description: 'One Platform. Every Campus. Smarter Education. Enterprise multi-tenant educational SaaS platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F8FC] text-[#17243A] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
