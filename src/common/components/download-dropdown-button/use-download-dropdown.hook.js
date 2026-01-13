import React, { useEffect, useRef, useState } from 'react';

function useDownloadDropdown({ text, setDownload }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const buttonDivRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(0);

  useEffect(() => {
    if (buttonDivRef.current) {
      setMenuWidth(buttonDivRef.current.offsetWidth);
    }
  }, [text, open]);

  const dropdownToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const dropdownClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const dropdownListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
      setDownload(false);
    }
  };
  return {
    open,
    anchorRef,
    buttonDivRef,
    menuWidth,
    dropdownClose,
    dropdownToggle,
    dropdownListKeyDown
  };
}

export default useDownloadDropdown;
