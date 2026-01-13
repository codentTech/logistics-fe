import React from "react";
import useOnScrollSelect from "./on-scroll-select.hook";
import Select from "../select/select.component";

function OnScrollSelect() {
  const { containerRef, options, handleSelectedProduct, isLoading } =
    useOnScrollSelect();
  return (
    <div
      ref={containerRef}
      className="product-container"
      //   style={{ height: '400px', overflowY: 'auto' }}
    >
      <Select
        name="product"
        options={options}
        onChange={(e, value) => handleSelectedProduct(value)}
        defaultValue="Select Product"
        className="text-sm"
      />
      {isLoading && <div>Loading...</div>}
    </div>
  );
}

export default OnScrollSelect;
