import React from "react";
import { Link } from "react-router-dom";
import gif from "../assets/notfound.gif";

function NotFound() {
  return (
    <div className="loading-page fofpage">
      <img src={gif} alt="not found gif" className="not-found" />
      <Link to="/" style={{ color: "white" }}>
        <p style={{ marginTop: "50px", fontSize: "2rem" }}>Back Home</p>
      </Link>
    </div>
  );
}

export default NotFound;
