import React, { useState, useEffect } from "react";
import db from "../database/users";
import dbRoom from "../database/gamerooms";
import Player from "./Player";
import ShareField from "./ShareField";
import ToggleGame from "./ToggleGame";

function PlayerList(props) {
  const [roomAdmin, setAdmin] = useState("");
  const players = db.useGetUsers(props.room);
  const admin = dbRoom.useGetAdmin(props.room).then((ad) => {
    setAdmin(ad);
  });
  const [userIdentity, setIdentity] = useState("");

  if (localStorage.getItem("user")) {
    db.useIdentifyUser(localStorage.getItem("user"), props.room).then((res) => {
      setIdentity(res);
    });
  }

  return (
    <div>
      <h2>Players</h2>
      <div className="player-tab">
        <Player players={players} admin={roomAdmin} room={props.room} />
      </div>
      <ShareField />
      {userIdentity === roomAdmin && <ToggleGame />}
    </div>
  );
}

export default PlayerList;
