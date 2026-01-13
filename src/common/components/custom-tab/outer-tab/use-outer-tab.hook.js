/* eslint-disable no-prototype-builtins */

'use client';

import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function useOuterTab(tabs) {
  const pathname = usePathname();
  const [activeOuterTab, setActiveTab] = useState(tabs[0].id);

  const handleOuterTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const activeTabTemplate = JSON.parse(localStorage.getItem('activeTabTemplate'));
    if (activeTabTemplate && activeTabTemplate.hasOwnProperty(pathname)) {
      setActiveTab(activeTabTemplate[pathname]);
    }
    if (activeTabTemplate && activeTabTemplate.hasOwnProperty(pathname)) {
      delete activeTabTemplate[pathname];
      localStorage.setItem('activeTabTemplate', JSON.stringify(activeTabTemplate));
    }
  }, [pathname]);

  return {
    handleOuterTabClick,
    activeOuterTab,
    setActiveTab
  };
}
