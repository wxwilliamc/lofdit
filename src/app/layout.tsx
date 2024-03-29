import Navbar from '@/components/Navbar'
import { cn } from '@/lib/utils'
import QueryProvider from '@/providers/query-provider'
import { ToastProvider } from '@/providers/toast-provider'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'


export const metadata = {
  title: 'Lofdit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter({ subsets: ['latin']})

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className={cn(`bg-white text-slate-900 antialiased light`, inter.className)}>
      <body className='min-h-screen pt-12 bg-slate-50 antialiased'>
        <QueryProvider>
          <ToastProvider />
          {/* @ts-expect-error server component*/}
          <Navbar />

          {authModal}

          <div className='container max-w-7xl h-full pt-12'>
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
