import { useState, useEffect } from "react";
// import firebase from "../firebase";
import db from "../firebase";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import roomdb from "./gamerooms";

// const ref = firebase.firestore().collection("users");
const ref = collection(db, "users");

function useGetUsers(room) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => {
          return doc.data();
        })
      );
    });
    return () => unsubscribe();
  }, []);

  // const filteredUsers = users.filter((user) => user.gameID === room);
  const filteredUsers = [];

  users.forEach((user) => {
    if (user.rooms) {
      user.rooms.forEach((r) => {
        if (r.gameID === room) {
          filteredUsers.push(r);
        }
      });
    }
  });

  return filteredUsers;
}

async function useGetRooms(playerID) {
  if (playerID !== undefined) {
    const docRef = doc(db, "users", playerID);
    const user = await (await getDoc(docRef)).data();
    let rooms = [];

    if (user.rooms) {
      user.rooms.forEach((r) => {
        rooms.push(r);
      });
    }
    return rooms;
  }
}

async function useIdentifyUser(playerID, room) {
  const docRef = doc(db, "users", playerID);
  const user = await (await getDoc(docRef)).data();
  let uname = null;

  if (user) {
    if (user.rooms) {
      user.rooms.forEach((r) => {
        if (r.gameID === room) {
          uname = r.username;
        }
      });
    }
  }
  return uname;
}

async function useAddUser() {
  await addDoc(ref, {
    id: "id",
    rooms: [],
  });
}

const useSetUser = async () => {
  if (!localStorage.getItem("user")) {
    try {
      const docRef = await addDoc(ref, {
        rooms: [],
      });
      console.log("Document written with ID: ", docRef.id);
      localStorage.setItem("user", docRef.id);
    } catch (err) {
      console.log(err);
    }
  }
  return localStorage.getItem("user");
};

async function useEditUser(user, uname, roomID) {
  //gameID : roomID, username : uname WHERE doc id = user
  const userReference = doc(db, "users", user);
  await updateDoc(userReference, {
    rooms: arrayRemove({
      gameID: roomID,
      username: "guest",
    }),
  }).then(() => {
    updateDoc(userReference, {
      rooms: arrayUnion({
        gameID: roomID,
        username: uname,
      }),
    });
  });
}

async function useAdmitUser(user, uname, roomID) {
  //gameID : roomID, username : uname WHERE doc id = user
  const userReference = doc(db, "users", user);
  await updateDoc(userReference, {
    rooms: arrayUnion({
      gameID: roomID,
      username: uname,
    }),
  });
}

async function useDeleteRoom(user, uname, room) {
  const userReference = doc(db, "users", user);
  await updateDoc(userReference, {
    rooms: arrayRemove({
      gameID: room,
      username: uname,
    }),
  }).then(roomdb.useRemoveUser(user, room));
}

export default {
  useSetUser,
  useGetUsers,
  useAddUser,
  useAdmitUser,
  useIdentifyUser,
  useEditUser,
  useGetRooms,
  useDeleteRoom,
};
