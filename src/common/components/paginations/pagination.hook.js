'use client';

import React, { useState } from 'react';

export default function PaginationHook({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = data.slice(startIndex, endIndex);
  const totalEntries = data.length;
  const firstEntry = startIndex + 1;
  const lastEntry = Math.min(endIndex, totalEntries);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  return {
    // Pagination
    currentPage,
    setCurrentPage,
    currentData,
    totalPages,
    firstEntry,
    lastEntry,
    totalEntries,
    handlePageClick,
    itemsPerPage,
    handleItemsPerPageChange
  };
}
