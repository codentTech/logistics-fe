'use client';

import { useState, useEffect } from 'react';

export default function useToaster(show, onClose) {
  const [openToaster, setOpenToaster] = useState(false);

  useEffect(() => {
    setOpenToaster(show);
  }, [show]);

  const toasterCloseHanlder = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }
    setOpenToaster(false);
    if (onClose) {
      onClose();
    }
  };

  const alertType = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'warning',
    info: 'info'
  };

  return { openToaster, setOpenToaster, alertType, toasterCloseHanlder };
}
