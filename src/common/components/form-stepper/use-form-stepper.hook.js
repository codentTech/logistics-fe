'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useFormStepperHook() {
  const [id, setId] = useState('');

  // useEffect(() => {
  //   const moduleName = module.toLowerCase();
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_MAIN_URL}/administration/${moduleName}/get-${moduleName}-id`
  //     )
  //     .then((res) => {
  //       if (res.data.status) {
  //         setId(res.data.result.data[`${moduleName}Id`]);
  //       } else {
  //         //   CustomAlert(res.data?.message, 'error');
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       // CustomAlert('Network Error', 'error');
  //     });
  // }, []);

  return {
    id,
    setId
  };
}
