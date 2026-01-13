import { useEffect, useState } from 'react';

function useCustomDropdown() {
  const [open, setOpen] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState('');

  const handleCreateItem = () => {
    setOpen(true);
  };

  useEffect(() => {
    setCurrentTemplate(
      JSON.parse(localStorage.getItem('currentTemplate')) &&
        JSON.parse(localStorage.getItem('currentTemplate')).name
    );
  });

  return { open, currentTemplate, setOpen, handleCreateItem };
}

export default useCustomDropdown;
