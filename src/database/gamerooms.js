import { useState, useEffect } from "react";
import db from "../firebase";
import userdb from "./users";
import {
  collection,
  addDoc,
  getDoc,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// const ref = firebase.firestore().collection("gamerooms");
const ref = collection(db, "gamerooms");

async function useAddRoom(user, player) {
  const docRef = await addDoc(ref, {
    admin: player,
    id: null,
    players: [user],
  });

  const addedRoom = doc(db, "gamerooms", docRef.id);
  await updateDoc(addedRoom, { id: docRef.id });
  return docRef.id;
}

function useGetRooms() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
      setRooms(
        querySnapshot.docs.map((doc) => {
          return doc.data();
        })
      );
    });
    return () => unsubscribe();
  }, []);
  return rooms;
}

async function useGetArticles(roomID) {
  const docRef = doc(db, "gamerooms", roomID);
  const room = await (await getDoc(docRef)).data();
  let articles = [];

  if (room) {
    if (room.articles) {
      room.articles.forEach((r) => {
        if (r.player === localStorage.getItem("user")) {
          articles.push(r);
        }
      });
    }
  }
  return articles;
}

async function useGetGameArticles(roomID) {
  const docRef = doc(db, "gamerooms", roomID);
  const room = await (await getDoc(docRef)).data();
  const currentPlayer = localStorage.getItem("user");
  let articles = [];

  if (room) {
    if (room.articles) {
      room.articles.forEach((r) => {
        if (room.players.includes(r.player) && r.player != currentPlayer) {
          articles.push(r);
        }
      });
    }
  }
  return articles;
}

async function useAddArticle(room, user, text, id) {
  const roomReference = doc(db, "gamerooms", room);
  await updateDoc(roomReference, {
    articles: arrayUnion({
      id: id,
      player: user,
      text: text,
    }),
  });
}

async function useRemoveArticle(room, user, text, id) {
  const roomReference = doc(db, "gamerooms", room);
  await updateDoc(roomReference, {
    articles: arrayRemove({
      id: id,
      player: user,
      text: text,
    }),
  });
}
async function useEditArticle(room, user, text, id) {
  const roomReference = doc(db, "gamerooms", room);

  await updateDoc(roomReference, {
    articles: arrayRemove({
      id: id,
      player: user,
      text: text.old,
    }),
  }).then(() => {
    updateDoc(roomReference, {
      articles: arrayUnion({
        id: id,
        player: user,
        text: text.new,
      }),
    });
  });
}
async function useGetAdmin(room) {
  // const [admin, setAdmin] = useState("");

  const docRef = doc(db, "gamerooms", room);
  const rm = await getDoc(docRef);

  if (rm) {
    return rm.data().admin;
  }
}

function useValidateRoom(roomID) {
  const rooms = useGetRooms();
  const exists = rooms.filter((room) => {
    return room.id === roomID;
  });

  return exists.length > 0 ? true : false;
}

async function useRoomExists(roomID) {
  const docRef = doc(db, "gamerooms", roomID);
  const room = await (await getDoc(docRef)).data();
  return room !== undefined;
}

async function useCheckUser(user, room) {
  const docRef = doc(db, "gamerooms", room.trim());
  const rm = await getDoc(docRef);
  if (rm.exists()) {
    const players = rm.data().players;

    if (!players.includes(user)) {
      userdb.useAdmitUser(user, "guest", room);

      await updateDoc(docRef, {
        players: arrayUnion(user),
      });
    }
    return true;
  } else {
    return false;
  }
}

// async function useCheckRoomStatus(room) {
//   const roomReference = doc(db, "gamerooms", room);
//   const rm = await getDoc(roomReference);
//   return rm.data().gamemode;
// }

async function useCheckRoomStatus(room) {
  const [status, setStatus] = useState(true);

  useEffect(() => {
    let cancel = false;

    const roomReference = doc(db, "gamerooms", room);
    const unsubscribe = onSnapshot(roomReference, (doc) => {
      if (cancel) return;
      try {
        setStatus(doc.data().gamemode);
      } catch (error) {
        return false;
      }
    });
    return () => {
      cancel = true;
    };
  }, []);
  return status;
}

async function useChangeRoomStatus(room, value) {
  const roomReference = doc(db, "gamerooms", room);
  await updateDoc(roomReference, {
    gamemode: value,
  });
}

async function useRemoveUser(user, room) {
  const roomReference = doc(db, "gamerooms", room);
  await updateDoc(roomReference, {
    players: arrayRemove(user),
  });
}

export default {
  useGetRooms,
  useValidateRoom,
  useCheckUser,
  useAddRoom,
  useGetAdmin,
  useGetArticles,
  useGetGameArticles,
  useAddArticle,
  useRemoveArticle,
  useEditArticle,
  useRemoveUser,
  useCheckRoomStatus,
  useChangeRoomStatus,
  useRoomExists,
};
