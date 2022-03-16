import React from "react";
import { MinimalSpinner } from "loading-animations-react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

function Loading() {
  return (
    <div className="loading-page">
      <div className="back-button">
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <IoArrowBackCircleSharp style={{ transform: "scale(3)" }} />
        </Link>
      </div>
      <div style={{ width: "30%" }}>
        <MinimalSpinner text="Loading..." color="cyan" />
      </div>
      <p
        style={{
          fontFamily: "monospace",
          color: "yellow",
          marginTop: "40px",
          padding: "0 20px",
        }}
      >
        If Room doesn't Load, Go back and verify the ID
      </p>
    </div>
  );
}

export default Loading;
