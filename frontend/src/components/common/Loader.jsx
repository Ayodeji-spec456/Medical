import React from "react";

const Loader = ({ size = "md", fullScreen = false }) => {
  const spinnerClass = `spinner ${size === "sm" ? "spinner-sm" : ""}`;

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
        }}
      >
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
      <div className={spinnerClass}></div>
    </div>
  );
};

export default Loader;
