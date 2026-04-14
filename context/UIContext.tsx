"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isPortfolioModalOpen: boolean;
  openPortfolioModal: () => void;
  closePortfolioModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

  const openPortfolioModal = () => {
    setIsPortfolioModalOpen(true);
    if (typeof (window as any).lenis !== 'undefined') (window as any).lenis.stop();
  };

  const closePortfolioModal = () => {
    setIsPortfolioModalOpen(false);
    if (typeof (window as any).lenis !== 'undefined') (window as any).lenis.start();
  };

  return (
    <UIContext.Provider value={{ isPortfolioModalOpen, openPortfolioModal, closePortfolioModal }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
