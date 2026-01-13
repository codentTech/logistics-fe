import React, { useEffect, useState } from 'react';

function usePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayData, setDisplayData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(1)

  useEffect(() => {
    // Calculate the total number of pages based on the data length and items per page
    const totalPagesCount = Math.ceil(data.length / itemsPerPage);
    setTotalPages(totalPagesCount);

    // Update the displayed data based on the current page and items per page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newData = data.slice(startIndex, endIndex);
    setDisplayData(newData);
  }, [currentPage, itemsPerPage, data]);

  const goToPage = (pageNumber) => {
    // Check if the requested page number is within the valid range
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return {
    currentPage,
    totalPages,
    displayData,
    goToPage,
    setCurrentPage,
    setTotalPages,
    setDisplayData
  };
}

export default usePagination;
