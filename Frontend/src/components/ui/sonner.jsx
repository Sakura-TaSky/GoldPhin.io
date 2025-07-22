import { useTheme } from '@/context/ThemeContext';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  const { theme } = useTheme();

  return <Sonner theme={theme === 'dark' ? 'light' : 'dark'} {...props} />;
};

export { Toaster };
