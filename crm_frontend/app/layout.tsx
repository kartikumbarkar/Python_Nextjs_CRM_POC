import { AuthProvider } from '../src/contexts/auth-context';
import './globals.css';
import DebugAuth from '../src/components/DebugAuth';

export const metadata = {
  title: 'CRM System',
  description: 'Multi-tenant CRM System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
        />
      </head>
      <body>
        <AuthProvider>
            <DebugAuth /> {/* Add this line */}

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}