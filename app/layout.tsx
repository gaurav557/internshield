import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'InternShield — Internship Verification', description: 'AI-assisted internship fraud detection and company verification platform.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><body>{children}</body></html>; }
