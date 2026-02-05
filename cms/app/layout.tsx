import './global.css';

export const metadata = {
  title: 'Manasik by Halijah App Admin',
  description: 'App Admin to manage the contents of Manasik by Halijah App',
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
