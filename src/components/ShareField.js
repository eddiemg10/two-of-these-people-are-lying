import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";

function ShareField() {
  const link = window.location.href;
  const { id } = useParams();
  const Ref = useRef(null);
  const [clipboard, setClipboard] = useState("");

  useEffect(() => {
    if (clipboard !== "") {
      setTimeout(() => {
        setClipboard("");
      }, 2500);
    }
  }, [clipboard]);
  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setClipboard("Link copied to clipboard");
  };
  return (
    <div style={{ marginTop: "50px" }}>
      {/* <ReactNotification /> */}
      <input
        type="text"
        readOnly
        value={id}
        className="share-input"
        ref={(el) => {
          Ref.current = el;
        }}
        data-tip="copied to clipboard"
      ></input>
      <button className="share-button" onClick={copyLink}>
        Share
      </button>
      <div
        className={clipboard === "" ? "notification-close" : "notification"}
        style={{ marginLeft: "calc(50% - 115px)", marginTop: "20px" }}
      >
        <div></div>
        <AiFillCheckCircle
          style={{
            color: "#37b830",
            transform: "scale(1.3)",
            marginRight: "20px",
          }}
        />
        {clipboard}
      </div>
    </div>
  );
}

export default ShareField;
