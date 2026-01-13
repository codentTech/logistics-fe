"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCallback, useState } from "react";

export default function useCustomInput(onChange, type, endIcon) {
  const [showPassword, setShowPassword] = useState(false);

  const borderErrorStyle = {
    border: "1px solid red",
  };

  const borderSuccessStyle = {
    border: "1px solid gray",
  };

  const passwordMouseDownHandler = (event) => {
    event.preventDefault();
  };

  const inputChangeHandler = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const getInputEndAdornment = useCallback(() => {
    if (type === "password") {
      return (
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword(!showPassword)}
          onMouseDown={passwordMouseDownHandler}
          onMouseUp={passwordMouseDownHandler}
          edge="end"
          size="small"
          sx={{
            padding: "4px",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "& .MuiSvgIcon-root": {
              fontSize: "18px",
              color: "#6B7280",
            },
          }}
        >
          {showPassword ? (
            <VisibilityOff />
          ) : (
            <Visibility />
          )}
        </IconButton>
      );
    }
    return endIcon;
  }, [type, showPassword, endIcon]);

  return {
    showPassword,
    inputChangeHandler,
    getInputEndAdornment,
    borderErrorStyle,
    borderSuccessStyle,
  };
}
