import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ArticleForm from "./ArticleForm";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import Article from "./Article";
import db from "../database/gamerooms";
import userdb from "../database/users";
import PlayerList from "./PlayerList";
import Modal from "react-modal";
import { MdDelete } from "react-icons/md";
import GameTab from "./GameTab";
import Loading from "./Loading";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [newUname, setUname] = useState("");
  const [modalIsOpen, openModal] = useState(false);
  const [err, setErr] = useState("");
  const [gamemode, setGamemode] = useState(true);
  const unameRef = useRef(null);
  let history = useHistory();

  const currentUser = localStorage.getItem("user");
  const players = userdb.useGetUsers(id);

  useEffect(() => {
    db.useGetArticles(id).then((articles) => {
      setArticles(articles);
    });
  }, []);

  db.useCheckRoomStatus(id).then((status) => {
    setGamemode(status);
  });

  useEffect(() => {
    if (unameRef.current) {
      unameRef.current.focus();
    }
  }, [newUname]);

  useEffect(() => {
    if (username === "guest") {
      openModal(true);
    }
  }, [username]);

  if (!db.useValidateRoom(id)) {
    // return <h1>{`Loading...`}</h1>;
    return <Loading />;
  }

  db.useCheckUser(currentUser, id).then(() => {
    userdb.useIdentifyUser(currentUser, id).then((uname) => {
      setUsername(uname);
    });
  });

  const joinRoom = () => {
    let exists = false;

    if (newUname) {
      setErr("");
      players.forEach((player) => {
        if (player.username === newUname) {
          setErr("Username has already been taken");
          exists = true;
        }
      });
      if (!exists) {
        //update the username
        userdb.useEditUser(currentUser, newUname, id);
        openModal(false);
      }
    }
  };

  const addArticle = (article) => {
    if (!article.text || /^\s*$/.test(article.text)) {
      return;
    }

    const newArticles = [...articles, article];
    setArticles(newArticles);
    // console.log(article, ...articles);
    db.useAddArticle(id, currentUser, article.text, article.id);
  };

  const editArticle = (artid, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
    setArticles((previous) =>
      previous.map((article) => {
        if (article.id === artid) {
          db.useEditArticle(
            id,
            currentUser,
            { old: article.text, new: newValue.text },
            artid
          );
          return newValue;
        } else {
          return article;
        }
      })
    );
  };

  // (article.id === id ? newValue : article)

  const removeArticle = (artid) => {
    const removeArr = [...articles].filter((article) => article.id !== artid);
    const articleToRemove = [...articles].filter(
      (article) => article.id === artid
    );
    setArticles(removeArr);

    db.useRemoveArticle(id, currentUser, articleToRemove[0].text, artid);
  };
  const completeArticle = (id) => {
    let updatedArticles = articles.map((article) => {
      if (article.id === id) {
        article.isComplete = !article.isComplete;
      }

      return article;
    });
    setArticles(updatedArticles);
  };
  const deleteRoom = (room) => {
    let prompt = "This room will be permanently deleted";
    if (window.confirm(prompt) == true) {
      userdb.useDeleteRoom(currentUser, username, id);
      history.push("/");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "80px" }}>
      <div className="back-button">
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <IoArrowBackCircleSharp style={{ transform: "scale(3)" }} />
        </Link>
      </div>

      <MdDelete onClick={() => deleteRoom(id)} className="delete-room" />
      <PlayerList room={id} />
      <div className="article-app">
        <h1 className="heading">List of Article titles</h1>
        {gamemode ? (
          <>
            <div className="card-tab">
              <GameTab />
            </div>
          </>
        ) : (
          <>
            <ArticleForm onSubmit={addArticle} onEdit={editArticle} />
            <Article
              articles={articles}
              completeArticle={completeArticle}
              removeArticle={removeArticle}
              editArticle={editArticle}
            />
          </>
        )}
        {/* // <ArticleForm onSubmit={addArticle} onEdit={editArticle} />
        // <Article
        //   articles={articles}
        //   completeArticle={completeArticle}
        //   removeArticle={removeArticle}
        //   editArticle={editArticle}
        // /> */}
      </div>

      <Modal
        className="modal-box"
        isOpen={modalIsOpen}
        onRequestClose={() => openModal(true)}
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
        <div className="modal-body">
          <input
            type="text"
            placeholder="Enter username"
            className="modal-input"
            value={newUname}
            ref={(el) => {
              unameRef.current = el;
            }}
            onChange={(e) => setUname(e.target.value)}
            autoComplete="off"
            maxLength="7"
          ></input>
          <span className="error" style={{ marginBottom: "-10px" }}>
            {err}
          </span>
          <button className="full-button" onClick={joinRoom}>
            Join Room
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ArticleList;
