import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pinindu Nuwandhara | Software Developer',
  description: 'Portfolio of Pinindu Nuwandhara, a web and mobile application developer based in Matara, Sri Lanka.',
  openGraph: { title: 'Pinindu Nuwandhara | Software Developer', description: 'Web and mobile application developer based in Matara, Sri Lanka.', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
