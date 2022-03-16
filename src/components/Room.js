import React, { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/avatars";
import { useHistory } from "react-router-dom";
import * as style from "@dicebear/avatars-bottts-sprites";
import db from "../database/users";
import MiniPlayerList from "./MiniPlayerList";
import Player from "./Player";

function Room(props) {
  let history = useHistory();
  let currentUser = localStorage.getItem("user");

  let avatar = (avSeed) => {
    return createAvatar(style, {
      seed: avSeed,
      dataUri: true,
      size: 80,

      // ... and other options
    });
  };

  let redirect = (path) => {
    history.push("/room/" + path);
  };

  return props.rooms.map((room, index) => (
    <div
      className="room article-row"
      key={index}
      onClick={() => {
        redirect(room.gameID);
      }}
    >
      <div
        style={{
          //   background: "rgba(245, 239, 226, 0.9)",
          border: "2px solid white",
          padding: "10px",
          borderRadius: "5px",
          marginRight: "20px",
        }}
      >
        <img src={avatar(room.username)} />
        <h4>{room.username}</h4>
      </div>
      <div className="list-container">
        <ul>
          <MiniPlayerList id={room.gameID} user={room.username} />
        </ul>
      </div>
    </div>
  ));
}

export default Room;
