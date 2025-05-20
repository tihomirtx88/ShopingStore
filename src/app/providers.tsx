"use client";

import React from "react";
import ThemeProvider from "./theme-provider";
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster richColors />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}

      </ThemeProvider>
    </>
  );
}
