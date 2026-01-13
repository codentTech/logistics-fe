'use client';

import { useEffect, useMemo, useState } from 'react';

export default function useOtpInput(maxInput, value, onChange) {
  const [otp, setOtp] = useState([]);

  const valueItems = useMemo(() => {
    const valueArray = value?.split('');
    const items = [];

    for (let i = 0; i < maxInput; i++) {
      let char = '';
      if (valueArray && valueArray?.length > 0 && valueArray[i]) {
        // if (RE_DIGIT.test(char)) {
        char = valueArray[i];
      }
      items.push(char);
    }

    return items;
  }, [value, maxInput]);

  useEffect(() => {
    setOtp(valueItems);
  }, [valueItems]);

  // useEffect(() => {
  // Only call onChange if all inputs are filled completely
  // if (otp.join().length === maxInput && onChange) {
  // onChange(otp.join());
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [otp]);

  const inputChangeHandler = (e) => {
    const inputValue = e.target.value.trim();
    if (inputValue.length > 1) {
      e.target.value = e.target.value.slice(0, -1);
    } else {
      const newOtp = [...otp];
      newOtp[e.target.id] = inputValue;
      onChange(newOtp.join(',').replaceAll(',', ''));
    }
    const { nextSibling } = e.target;
    const { previousSibling } = e.target;

    if (nextSibling && inputValue !== '') {
      nextSibling.focus();
    }

    if (previousSibling && inputValue.length === 0) {
      previousSibling.focus();
    }
  };

  const inputKeyDownHandler = (e) => {
    if (
      e.key === 'Backspace' &&
      e.target.previousSibling &&
      e.target.value.trim() === ''
    ) {
      e.target.previousSibling.focus();
    }
  };

  return { valueItems, inputChangeHandler, inputKeyDownHandler, otp };
}
