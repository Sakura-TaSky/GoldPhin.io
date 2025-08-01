import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { UiStateProvider } from '@/context/UiStateContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import WagmiContext from './context/WagmiContext';

const App = () => {
  return (
    <WagmiContext>
      <TooltipProvider>
        <ThemeProvider>
          <UiStateProvider>
            <AppLayout />
            <Toaster />
          </UiStateProvider>
        </ThemeProvider>
      </TooltipProvider>
    </WagmiContext>
  );
};

export default App;
