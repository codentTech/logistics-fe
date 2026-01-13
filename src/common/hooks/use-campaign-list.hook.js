import { useState } from "react";

function useCampaignList() {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: 1, label: "March Moisturizer Campaign" },
    { value: 2, label: "March Sunscreen Campaign" },
    { value: 3, label: "March Anti-Aging Campaign" },
    { value: 4, label: "March Gifted Collabs" },
    { value: 5, label: "April Potentials" },
  ];

  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  return {
    options,
    selectedOption,
    setSelectedOption,
  };
}

export default useCampaignList;
