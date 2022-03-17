import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import db from "../database/users";
import dbRoom from "../database/gamerooms";
import { RiCloseCircleLine } from "react-icons/ri";
import MediaQuery from "react-responsive";
import RoomList from "./RoomList";

Modal.setAppElement("#root");
function Home(props) {
  const [input, setInput] = useState("");
  // const [user, setUser] = useState("");
  const [ready, setReady] = useState(false);
  const [uname, setUname] = useState("");
  const [roomErr, setRoomErr] = useState("");

  const [roomMembers, setRoomMembers] = useState([]);
  const [modalIsOpen, openModal] = useState(false);

  const inputRef = useRef(null);
  const unameRef = useRef(null);
  const user = localStorage.getItem("user");

  let history = useHistory();

  useEffect(() => {
    inputRef.current.focus();
  });

  useEffect(() => {
    if (unameRef.current) {
      unameRef.current.focus();
    }
  }, [uname]);

  const handleText = (e) => {
    setInput(e.target.value);
  };

  const handleUname = (e) => {
    // if (uname.length < 8) {
    //   setUname(e.target.value);
    // }
    setUname(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input,
    });

    setInput("");
  };

  const joinRoom = () => {
    //Check if user already exists in room list. if not, admit them
    if (input) {
      dbRoom.useCheckUser(user, input).then((exists) => {
        if (exists) {
          setRoomErr("");
          history.push("/room/" + input.trim());
        } else {
          setRoomErr("Room doesn't exist!");
        }
      });
    }
  };

  const toggleModal = () => {
    openModal(true);
  };

  const createRoom = () => {
    dbRoom.useAddRoom(user, uname).then((room) => {
      db.useAdmitUser(user, uname, room).then(history.push("/room/" + room));
    });
  };

  return (
    <div className="container">
      <MediaQuery maxWidth={820}>
        <Modal
          className="modal-box-sm"
          isOpen={modalIsOpen}
          onRequestClose={() => openModal(false)}
          style={{
            content: {
              width: "96%",
              height: "58%",
              // margin: "0 auto",
              background: "rgb(208, 255, 235)",
              overflow: "hidden",
              top: "20%",
              borderRadius: "10px",
            },
          }}
        >
          <RiCloseCircleLine
            onClick={() => openModal(false)}
            className="close-modal"
          />
          <div className="modal-body">
            <input
              type="text"
              placeholder="Enter username"
              className="modal-input"
            ></input>
            <button className="full-button" onClick={createRoom}>
              Create New Room
            </button>
          </div>
        </Modal>
      </MediaQuery>

      <MediaQuery minWidth={820}>
        <Modal
          className="modal-box"
          isOpen={modalIsOpen}
          onRequestClose={() => openModal(false)}
          style={{
            content: {
              width: "50%",
              height: "70%",
              margin: "0 auto",
              background: "rgb(208, 255, 235)",
              overflow: "hidden",
              top: "20%",
              borderRadius: "10px",
            },
          }}
        >
          <RiCloseCircleLine
            onClick={() => openModal(false)}
            className="close-modal"
          />
          <div className="modal-body">
            <input
              type="text"
              placeholder="Enter username"
              className="modal-input"
              value={uname}
              ref={(el) => {
                unameRef.current = el;
              }}
              onChange={(e) => setUname(e.target.value)}
              autoComplete="off"
              maxLength="7"
            ></input>
            <button className="full-button" onClick={createRoom}>
              Create New Room
            </button>
          </div>
        </Modal>
      </MediaQuery>

      <div>
        <img
          src="https://fontmeme.com/permalink/220227/0b89600a29318a5bf688150bb2a040df.png"
          // src="https://fontmeme.com/permalink/220316/9e91d0751974ececa9f0721ea7e06e54.png"
          className="banner"
        />
      </div>
      <div className="container background">
        <div className="home-group">
          <input
            type="text"
            placeholder="Enter Code"
            value={input}
            name="entry"
            className="room-input"
            onChange={handleText}
            autoComplete="off"
            ref={inputRef}
          />
          <button className="home-button" onClick={joinRoom}>
            Join Room
          </button>
        </div>
        <span className="error" style={{ paddingTop: "10px" }}>
          {roomErr}
        </span>
        <button className="full-button" onClick={toggleModal}>
          Create New Room
        </button>
      </div>
      <RoomList />
    </div>
  );
}

export default Home;
