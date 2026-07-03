import { Fraunces, Inter } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  weight: ['400', '500', '600'],
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});
