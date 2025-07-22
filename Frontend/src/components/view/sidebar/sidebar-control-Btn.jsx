import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PiSidebarSimpleLight } from 'react-icons/pi';
import useUiState from '@/context/UiStateContext';
import { useShortCuts } from '@/hooks';

const SidebarControlBtn = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useUiState();

  useShortCuts('shift+s', () => {
    setIsSidebarOpen(!isSidebarOpen);
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
          className={`p-1 rounded z-50 cursor-pointer h-fit w-fit hover:bg-zinc-500/20 fixed top-2 opacity-50 hover:opacity-100 smooth
            ${isSidebarOpen ? 'ml-50.5' : 'ml-1.5'}
            `}
        >
          <PiSidebarSimpleLight size={22} strokeWidth={2} />
        </button>
      </TooltipTrigger>
      <TooltipContent className="font-medium text-xs">Shift + s</TooltipContent>
    </Tooltip>
  );
};

export default SidebarControlBtn;
