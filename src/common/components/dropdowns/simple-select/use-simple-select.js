import React, { useEffect, useRef, useState } from "react";

const CloseIcon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
    </svg>
  );
};

function useSimpleSelect({
  placeholder,
  options,
  isMulti,
  isSearchable,
  onChange,
  defaultValue,
  value,
  disabled,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(() => {
    if (value !== undefined) {
      if (isMulti) {
        return Array.isArray(value)
          ? value.map((val) => options?.find((opt) => opt.value === val)).filter(Boolean) || []
          : [];
      } else {
        return options?.find((opt) => opt.value === value) || null;
      }
    }
    if (defaultValue !== undefined) {
      if (isMulti) {
        return Array.isArray(defaultValue)
          ? defaultValue.map((val) => options?.find((opt) => opt.value === val)).filter(Boolean) ||
              []
          : [];
      } else {
        return options?.find((opt) => opt.value === defaultValue) || null;
      }
    }
    return isMulti ? [] : null;
  });
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (value !== undefined) {
      if (isMulti) {
        setSelectedValue(
          Array.isArray(value)
            ? value.map((val) => options?.find((opt) => opt.value === val)).filter(Boolean) || []
            : []
        );
      } else {
        setSelectedValue(options?.find((opt) => opt.value === value) || null);
      }
    }
  }, [value, options, isMulti]);

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const handleInputClick = (e) => {
    if (!disabled) {
      setShowMenu(!showMenu);
    }
  };

  const getDisplay = () => {
    if (!selectedValue || (isMulti && selectedValue.length === 0)) {
      return placeholder || "Select an option...";
    }

    if (isMulti) {
      return (
        <div className="flex flex-wrap gap-[5px]">
          {selectedValue.map((option) => (
            <div
              key={option.value}
              className="flex gap-3 items-center rounded-lg bg-gray-100 text-black px-2"
            >
              {option.label}
              <span onClick={(e) => onTagRemove(e, option)} className="flex items-center ml-1">
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
      );
    }

    return selectedValue.label;
  };

  const removeOption = (option) => {
    return selectedValue.filter((o) => o.value !== option.value);
  };

  const onTagRemove = (e, option) => {
    e.stopPropagation();
    const newValue = removeOption(option);
    setSelectedValue(newValue);
    if (onChange) {
      onChange(isMulti ? newValue.map((opt) => opt.value) : newValue?.value);
    }
  };

  const onItemClick = (option) => {
    let newValue;
    if (isMulti) {
      if (selectedValue.findIndex((o) => o.value === option.value) >= 0) {
        newValue = removeOption(option);
      } else {
        newValue = [...selectedValue, option];
      }
    } else {
      newValue = option;
      setShowMenu(false);
    }
    setSelectedValue(newValue);
    if (onChange) {
      onChange(isMulti ? newValue.map((opt) => opt.value) : newValue?.value);
    }
  };

  const isSelected = (option) => {
    if (isMulti) {
      return selectedValue.filter((o) => o.value === option.value).length > 0;
    }

    if (!selectedValue) {
      return false;
    }

    return selectedValue.value === option.value;
  };

  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getOptions = () => {
    if (!searchValue) {
      return options;
    }

    return (
      options &&
      options.filter(
        (option) => option && option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
      )
    );
  };

  const clearSelection = () => {
    const newValue = isMulti ? [] : null;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(isMulti ? [] : null);
    }
  };

  return {
    inputRef,
    handleInputClick,
    getDisplay,
    showMenu,
    onSearch,
    searchValue,
    searchRef,
    getOptions,
    onItemClick,
    isSelected,
    clearSelection,
  };
}

export default useSimpleSelect;
