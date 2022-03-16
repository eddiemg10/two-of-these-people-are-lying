import React, { useState, useEffect } from "react";
import db from "../database/gamerooms";
import { useParams } from "react-router-dom";

function ToggleGame() {
  const [state, setState] = useState(false);
  const { id } = useParams();

  const toggle = () => {
    setState(!state);
    db.useChangeRoomStatus(id, !state);
  };
  return (
    <div>
      <button
        className={state ? "half-button stop-game" : "half-button start-game"}
        onClick={toggle}
      >
        {state ? "Stop" : "Start"}
      </button>
    </div>
  );
}

export default ToggleGame;
