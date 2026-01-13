import React from "react";

function Loader({ loading, size = 10, color = "gray-600" }) {
  if (!loading) return null;

  const sizePx = `${size}px`;
  const borderWidth = Math.max(3, Math.floor(size / 16));

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className="animate-spin rounded-full border-solid border-t-transparent"
        style={{
          width: sizePx,
          height: sizePx,
          borderWidth: `${borderWidth}px`,
          borderColor: `${color} transparent ${color} ${color}`,
        }}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loader;
