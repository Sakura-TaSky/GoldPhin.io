import { createContext, useContext, useEffect, useState } from 'react';

const UiStateContext = createContext();

export const UiStateProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isList, setIsList] = useState(
    () => localStorage.getItem('isList') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isList', isList);
  }, [isList]);

  const values = {
    isSidebarOpen,
    setIsSidebarOpen,
    isList,
    setIsList,
  };

  return (
    <UiStateContext.Provider value={values}>{children}</UiStateContext.Provider>
  );
};

export default function useUiState() {
  return useContext(UiStateContext);
}
