import './globals.css';
import AdminSidebar from '@/components/AdminSidebar';

export const metadata = {
  title: 'EDUVANTA - Super Admin Executive Portal',
  description: 'Smart Campus Management Ecosystem Platform Control',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B132B] text-slate-100 flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
