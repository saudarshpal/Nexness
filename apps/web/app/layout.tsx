import type { Metadata } from "next";
import { IBM_Plex_Serif, Instrument_Serif , IBM_Plex_Mono} from 'next/font/google'
import "./globals.css";
import { Providers } from "./providers";

const ibmPlexSerif = IBM_Plex_Serif({
  variable : "--font-ibm-plex-serif",
  subsets : ["latin"],
  weight : ["400","600"]
})

const instrumentSerif = Instrument_Serif({
  variable : "--font-instrument-serif",
  subsets : ["latin"],
  weight : ["400"]
})


const ibmPlexMono = IBM_Plex_Mono({
  variable : "--font-ibm-plex-mono",
  subsets : ["latin"],
  weight : ["400","500"]
})



export const metadata: Metadata = {
  title: "Exness App",
  description: "Real-time CFD trading with institutional-grade execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSerif.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
