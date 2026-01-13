import { Pagination, PaginationItem, styled } from "@mui/material/node";
import React from "react";
import usePaginationHook from "./pagination-enteries.hook";

function PaginationComponent({
  data,
  action,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) {
  const StyledPaginationItem = styled(PaginationItem)(({ theme }) => ({
    backgroundColor: "#E4E4E4",
    color: "black",
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
    },
    borderRadius: "4px",
    margin: "4px",
  }));

  const { totalPages, handlePagination } = usePaginationHook({
    data,
    action,
    currentPage,
    itemsPerPage,
    setCurrentPage,
  });

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-[8px] pl-1 font-dm text-xs font-normal not-italic leading-[18px]">
        <div>
          <span className="font-dm text-xs font-normal not-italic leading-[18px]">
            Show
          </span>
          <select className="ml-2 h-[27px] w-[52px] rounded border border-solid border-[#E0E7ED] px-1 outline-none ">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <p className=" pl-1">
          entries
          <span className="leading-[18px]; pl-1 font-dm text-xs font-normal not-italic">
            {currentPage === 1
              ? currentPage
              : currentPage * itemsPerPage - itemsPerPage}
          </span>
          <span className="pl-1 text-text-ultra-light-gray">
            to {currentPage * itemsPerPage} of {data.length} entries
          </span>
        </p>
      </div>
      <div className="flex w-[40%] justify-end gap-[12px]">
        <Pagination
          color="primary"
          shape="rounded"
          count={totalPages}
          page={currentPage}
          renderItem={(item) => <StyledPaginationItem {...item} />}
          onChange={(event, value) => handlePagination(value)}
        />
      </div>
    </div>
  );
}

export default PaginationComponent;
