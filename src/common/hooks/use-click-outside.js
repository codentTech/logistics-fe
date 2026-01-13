import { useEffect } from 'react';

const useClickOutside = (refs = [], setStates = []) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      refs.forEach((ref, index) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setStates[index](false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, setStates]);
};

export default useClickOutside;
