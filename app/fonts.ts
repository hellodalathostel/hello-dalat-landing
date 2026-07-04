import { Fraunces, Inter } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  // Fraunces là variable font — dùng weight "variable" để giữ được axes
  // opsz/SOFT/WONK (next/font không cho khai axes kèm weight cố định).
  weight: 'variable',
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});