import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/service-worker-register'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Support Bot - Advanced 24/7 Support',
  description: 'AI-powered customer support chatbot with offline capabilities and message history',
  generator: 'v0.app',
  applicationName: 'Support Bot',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Support Bot',
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><defs><linearGradient id="g"><stop offset="0%25" style="stop-color:%232563eb"/><stop offset="100%25" style="stop-color:%231d4ed8"/></linearGradient></defs><rect fill="url(%23g)" width="192" height="192" rx="40"/><text x="96" y="130" font-size="100" font-weight="bold" fill="white" text-anchor="middle">?</text></svg>',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><defs><linearGradient id="g"><stop offset="0%25" style="stop-color:%232563eb"/><stop offset="100%25" style="stop-color:%231d4ed8"/></linearGradient></defs><rect fill="url(%23g)" width="180" height="180" rx="40"/><text x="90" y="120" font-size="90" font-weight="bold" fill="white" text-anchor="middle">?</text></svg>',
  },
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-slate-900`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="dark" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Support Bot" />
      </head>
      <body className="font-sans antialiased bg-slate-900">
        <ServiceWorkerRegister />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
