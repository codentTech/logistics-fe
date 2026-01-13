import { City } from 'country-state-city';
import { useState } from 'react';

export default function useCountryCity() {
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState('');
  const [error, setError] = useState({ country: '' });

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setError('');
    if (e.target.value) {
      const [name, code] = e.target.value.split('-');
      const _cities = City.getCitiesOfCountry(code);
      const cityOptions = _cities.map((cit) => ({
        label: cit.name,
        value: cit.name.toLowerCase()
      }));
      setCities(cityOptions);
    }
  };

  return {
    handleCountryChange,
    cities,
    country,
    setCountry,
    error,
    setError
  };
}
