import './globals.css';

export const metadata = {
  title: 'Headless WordPress + React',
  description: 'Frontend React fetching posts from a WordPress backend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
