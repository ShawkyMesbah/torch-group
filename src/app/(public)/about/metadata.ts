import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Torch | Our Story & Values',
  description: 'Learn about Torch, our mission, core values, and the passionate team driving innovation and growth for our clients.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Torch | Our Story & Values',
    description: 'Learn about Torch, our mission, core values, and the passionate team driving innovation and growth for our clients.',
    url: 'https://torchgroup.co/about',
    type: 'website',
    images: [
      {
        url: 'https://torchgroup.co/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'About Torch'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Torch | Our Story & Values',
    description: 'Learn about Torch, our mission, core values, and the passionate team driving innovation and growth for our clients.',
  },
}; 