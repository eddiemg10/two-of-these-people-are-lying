import React, { useState, useEffect } from "react";
import userdb from "../database/users";

function MiniPlayerList(props) {
  const players = userdb.useGetUsers(props.id);

  return players.map((player, index) => {
    if (player.username !== props.user) {
      return <li key={index}>{player.username}</li>;
    }
  });
}

export default MiniPlayerList;
