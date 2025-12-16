import './global.css';

export const metadata = {
  title: 'Halijah Manasik App Admin',
  description: 'App Admin to manage the contents of Halijah Manasik App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
