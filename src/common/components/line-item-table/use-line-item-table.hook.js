import { useEffect, useRef, useState } from 'react';

export default function useLineItemTable(setLineItemIndexing) {
  // this is the very initial code. will change these names 
  const [inputFocus1, setinputFocus1] = useState(false);
  const inputRef1 = useRef(null);
  const [inputFocus2, setinputFocus2] = useState(false);
  const inputRef2 = useRef(null);
  const [inputFocus3, setinputFocus3] = useState(false);
  const inputRef3 = useRef(null);
  const [inputFocus4, setinputFocus4] = useState(false);
  const inputRef4 = useRef(null);
  const [inputFocus5, setinputFocus5] = useState(false);
  const inputRef5 = useRef(null);
  const [showEditableFields, setShowEditableFields] = useState(false);

  useEffect(() => {
    if (inputFocus1 && inputRef1.current) {
      inputRef1.current.focus();
      setinputFocus1(false);
    }
    if (inputFocus2 && inputRef2.current) {
      inputRef2.current.focus();
      setinputFocus2(false);
    }
    if (inputFocus3 && inputRef3.current) {
      inputRef3.current.focus();
      setinputFocus3(false);
    }
    if (inputFocus4 && inputRef4.current) {
      inputRef4.current.focus();
      setinputFocus4(false);
    }
    if (inputFocus5 && inputRef5.current) {
      inputRef5.current.focus();
      setinputFocus5(false);
    }
  }, [inputFocus1, inputFocus2, inputFocus3, inputFocus4, inputFocus5]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const validFields = [
        inputRef1.current?.name,
        inputRef2.current?.name,
        inputRef3.current?.name,
        inputRef4.current?.name,
        inputRef5.current?.name
      ];
      if (
        (event?.target?.name || event?.target?.id) &&
        (validFields.includes(event.target.name) || validFields.includes(event.target.id))
      ) {
        setShowEditableFields(true);
      } else {
        setShowEditableFields(false);
        setLineItemIndexing && setLineItemIndexing('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputFocus1, inputFocus2, inputFocus3, inputFocus4, inputFocus5]);

  return {
    inputFocus1,
    setinputFocus1,
    inputRef1,
    inputFocus2,
    setinputFocus2,
    inputRef2,
    inputFocus3,
    setinputFocus3,
    inputRef3,
    inputRef4,
    setinputFocus4,
    showEditableFields,
    setinputFocus5,
    inputRef5
  };
}
