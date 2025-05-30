'use-client'

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes'; 

import React from 'react';

export default function ThemeProvider({children, ...props}: ThemeProviderProps) {
  return (
    <NextThemeProvider {...props}>{children}</NextThemeProvider>
  )
}
