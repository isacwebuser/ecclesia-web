import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Building2, LayoutGrid, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScope, Scope } from '../context/ScopeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export const ScopeSwitcher: React.FC = () => {
  const { scope, setScope, availableScopes } = useScope();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only show for Global Admin
  if (user?.role !== 'GLOBAL_ADMIN' && user?.role !== 'ADMIN') {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentScope = availableScopes.find(s => s.id === scope);

  const getIcon = (id: Scope) => {
    switch (id) {
      case 'CONSOLIDATED': return <Globe className="w-4 h-4" />;
      case 'SEDE': return <Building2 className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
          "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
          isOpen && "ring-2 ring-emerald-500/20 border-emerald-500/50"
        )}
      >
        <div className="text-emerald-600">
          {getIcon(scope)}
        </div>
        <span className="hidden sm:inline">{currentScope?.label}</span>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden"
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Escopo de Visualização
            </div>
            {availableScopes.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setScope(s.id);
                  setIsOpen(false);
                  window.location.reload();
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors",
                  scope === s.id 
                    ? "bg-emerald-50 text-emerald-700 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(scope === s.id ? "text-emerald-600" : "text-gray-400")}>
                    {getIcon(s.id)}
                  </div>
                  {s.label}
                </div>
                {scope === s.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
