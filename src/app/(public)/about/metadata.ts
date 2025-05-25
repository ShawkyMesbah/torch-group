import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Torch Group | Our Story & Values',
  description: 'Learn about Torch Group, our mission, core values, and the passionate team driving innovation and growth for our clients.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Torch Group | Our Story & Values',
    description: 'Learn about Torch Group, our mission, core values, and the passionate team driving innovation and growth for our clients.',
    url: 'https://torchgroup.co/about',
    type: 'website',
    images: [
      {
        url: 'https://torchgroup.co/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Torch Group'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Torch Group | Our Story & Values',
    description: 'Learn about Torch Group, our mission, core values, and the passionate team driving innovation and growth for our clients.',
  },
}; 