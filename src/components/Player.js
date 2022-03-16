import React, { useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";
import { AiFillStar, AiOutlineBorder } from "react-icons/ai";
import db from "../database/users";

function Player(props) {
  const [userIdentity, setIdentity] = useState("");
  let avatar = (avSeed) => {
    return createAvatar(style, {
      seed: avSeed,
      dataUri: true,
      size: 100,

      // ... and other options
    });
  };

  if (localStorage.getItem("user")) {
    db.useIdentifyUser(localStorage.getItem("user"), props.room).then((res) => {
      setIdentity(res);
    });
  }

  return props.players.map((player, index) => (
    <div
      className="player"
      key={index}
      style={{
        // border: userIdentity === player.username ? "2px solid white" : "none",
        border:
          userIdentity === player.username
            ? "3px solid rgb(162 255 193)"
            : "none",
      }}
    >
      {props.admin === player.username && <AiFillStar className="admin-icon" />}
      <img src={avatar(player.username)} />
      <h3>{player.username}</h3>
    </div>
  ));
}

export default Player;
