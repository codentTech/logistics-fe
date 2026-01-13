'use client';

import React, { useState } from 'react';

export default function useInnerTab(tabs) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };
  return {
    handleTabClick,
    activeTab,
    setActiveTab
  };
}
