import { useEffect, useState } from 'react';

export default function useDataTablePageSize() {
  const [tablePageSize, setTablePageSize] = useState(25);
  useEffect(() => {
    setTablePageSize(Number(localStorage.getItem('defaultNumberOfRecords')) || 25);
  }, []);

  return { tablePageSize, setTablePageSize };
}
