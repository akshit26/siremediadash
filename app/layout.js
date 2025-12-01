import './globals.css';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '600', '700', '800'] });

export const metadata = {
  title: 'Sire Media | Influencer Discovery',
  description: 'Discover influencers and brands with Sire Media.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.className}>
      <body>{children}</body>
    </html>
  );
}
