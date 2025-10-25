import { Header } from '../../src/components/layout/header';
import { Sidebar } from '../../src/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <main>
          {children}
        </main>
      </div>
    </>
  );
}