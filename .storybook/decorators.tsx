import { StreamProvider } from '@/app/components/stream-provider';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export const withProviders = (Story: () => ReactNode) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <StreamProvider>
        <Story />
      </StreamProvider>
    </ThemeProvider>
  );
}; 