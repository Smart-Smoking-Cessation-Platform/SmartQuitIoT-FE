import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import 'antd/dist/reset.css'
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { ChakraProviders } from "@/providers/chakra-provider"

const poppins = Poppins({ subsets: ["latin"], weight: ["300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: "SmartQuit - Your Journey to a Smoke-Free Life",
  description: "Join thousands of people who have successfully quit smoking with SmartQuit. Get personalized support, track your progress, and achieve your smoke-free goals.",
  keywords: ["quit smoking", "smoke free", "nicotine addiction", "health", "wellness", "motivation"],
  authors: [{ name: "SmartQuit Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ChakraProviders>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ChakraProviders>
      </body>
    </html>
  )
}
