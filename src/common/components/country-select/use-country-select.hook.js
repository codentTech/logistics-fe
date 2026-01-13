'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import COUNTRIES from '@/common/constants/countries.constant';

export default function useCountrySelect() {
  const [country, setCountry] = useState({});
  const [cities, setCities] = useState({});
  const [notFound, setNotFound] = useState({});

  useEffect(() => {
    // if (country !== '') {
    // axios
    //   .post('https://countriesnow.space/api/v0.1/countries/cities', data: {
    //     country:
    //   })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // }
    const _cities = {};
    const _notFound = {};
    // COUNTRIES.forEach((country) => {
    //   axios
    //     .post('https://countriesnow.space/api/v0.1/countries/cities', {
    //       country: country.value
    //     })
    //     .then((response) => {
    //       console.log('Response =>', response);
    //       if (!response.data.error) {
    //         _cities[country.value] = response.data.data;
    //       } else {
    //         _notFound[country.value] = response.data.error;
    //       }
    //     })
    //     .catch((err) => {
    //       console.error('Error:', err);
    //       _notFound[country.value] = JSON.stringify(err, null, 2);
    //     });
    // });
    // setCities(_cities);
    // setNotFound(_notFound);
  }, []);

  // console.log('cities =>', cities);
  // console.log('notFound =>', notFound);

  return {};
}
