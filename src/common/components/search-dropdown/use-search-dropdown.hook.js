import React, { useEffect, useRef, useState } from 'react';

function useSearchableDropdown({ setSearchText, setSelectedColumn }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchFilter = (e, columnName) => {
    setSelectedColumn(columnName);
    setOpen(false);
  };

  return {
    ref,
    open,
    setOpen,
    handleSearch,
    handleSearchFilter
  };
}

export default useSearchableDropdown;
