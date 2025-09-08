import './globals.css';
import ReduxProvider from './ReduxProvider';
import { Toaster } from 'sonner';
import UserProfileHydrator from './components/UserProfileHydrator';

export const metadata = {
  title: 'Best Wishes',
  description: 'Make your loved ones happy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <ReduxProvider>
          <UserProfileHydrator />
          {children}
          <Toaster position="top-center" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}
