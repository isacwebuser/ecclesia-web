import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Scope = 'CONSOLIDATED' | 'SEDE' | 'FILIAL_A' | 'FILIAL_B';

interface ScopeContextType {
  scope: Scope;
  setScope: (scope: Scope) => void;
  availableScopes: { id: Scope; label: string }[];
}

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

const SCOPES: { id: Scope; label: string }[] = [
  { id: 'CONSOLIDATED', label: 'Consolidado' },
  { id: 'SEDE', label: 'Sede' },
  { id: 'FILIAL_A', label: 'Filial A' },
  { id: 'FILIAL_B', label: 'Filial B' },
];

export function ScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setInternalScope] = useState<Scope>(() => {
    const saved = localStorage.getItem('app_scope');
    return (saved as Scope) || 'CONSOLIDATED';
  });

  const setScope = (newScope: Scope) => {
    setInternalScope(newScope);
    localStorage.setItem('app_scope', newScope);
    // Optional: window.location.reload() to force all components to refetch with new scope
    // But better to let React state handle it if services use the context
  };

  return (
    <ScopeContext.Provider value={{ scope, setScope, availableScopes: SCOPES }}>
      {children}
    </ScopeContext.Provider>
  );
}

export const useScope = () => {
  const context = useContext(ScopeContext);
  if (context === undefined) {
    throw new Error('useScope must be used within a ScopeProvider');
  }
  return context;
};
