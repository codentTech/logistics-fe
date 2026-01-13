/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';

export default function useSelectWithModel(option) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOptionClick = (option) => {
    if (option?.isModal) {
      setIsModalOpen(true);
    }
  };

  const renderOption = (props, option, { selected }) => {
    const isModalOption = option?.isModal;
    const optionClassName = isModalOption ? 'modal-option' : '';

    return (
      <li
        {...props}
        key={option?.label}
        className={optionClassName}
        onClick={() => handleOptionClick(option)}
      >
        {option?.label}
      </li>
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return {
    handleModalClose,
    handleOptionClick,
    renderOption,
    isModalOpen,
    setIsModalOpen,
    selectedOption,
    setSelectedOption
  };
}
