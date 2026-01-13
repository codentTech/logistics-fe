import React from "react";
import Breadcrumbs from "@mui/material/node/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";

export default function Breadscrumb({ breadscrumbs, current }) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadscrumbs.map((item) => {
        return (
          <Link
            key={item.id}
            className="font-dm text-base font-normal leading-5 text-text-gray3 hover:underline"
            href={item.link}
          >
            {item.name}
          </Link>
        );
      })}

      <h4 className="font-dm font-medium text-base leading-5 text-primary">
        {current}
      </h4>
    </Breadcrumbs>
  );
}
