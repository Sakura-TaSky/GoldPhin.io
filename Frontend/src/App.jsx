import React from 'react';
import AppLayout from '@/layout/AppLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { UiStateProvider } from '@/context/UiStateContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const App = () => {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <UiStateProvider>
          <AppLayout />
          <Toaster />
        </UiStateProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
};

export default App;
