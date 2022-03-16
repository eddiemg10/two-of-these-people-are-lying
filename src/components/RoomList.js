import React, { useEffect, useState } from "react";
import db from "../database/users";
import Room from "./Room";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const user = localStorage.getItem("user");
  useEffect(() => {
    db.useGetRooms(user).then((rooms) => {
      setRooms(rooms);
    });
  }, []);

  //   const players = db.useGetUsers(props.room);

  return (
    <div style={{ marginTop: "100px" }}>
      <h1 className="heading" style={{ marginBottom: "40px" }}>
        Previous Rooms
      </h1>
      <div className="player-tab">
        <Room rooms={rooms} />
      </div>
    </div>
  );
}

export default RoomList;
