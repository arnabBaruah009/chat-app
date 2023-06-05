import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

import styles from "../styles/user.module.css";

const User = ({ user, handleClick, active }) => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [lastMessage, setLastMessage] = useState("");

  const combinedID =
    currentUser.uid > user.uid
      ? currentUser.uid + user.uid
      : user.uid + currentUser.uid;

  useEffect(() => {
    const fetchLastMessage = async () => {
      const unsub = await onSnapshot(doc(db, "chats", combinedID), (doc) => {
        if (doc.exists() && doc.data().messages.length > 0) {
          let index = doc.data().messages.length - 1;
          setLastMessage(doc.data().messages[index].text);
        }
      });
      return () => {
        unsub();
      };
    };
    fetchLastMessage();
  }, []);

  const handleSelect = async () => {
    handleClick(user);

    try {
      const res = await getDoc(doc(db, "chats", combinedID));

      //if chats doesn't exists
      if (!res.exists()) {
        //create chats
        await setDoc(doc(db, "chats", combinedID), { messages: [] });
      }

      dispatch({ type: "CHANGE_USER", payload: user });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`${styles.container} ${active ? styles.active : ""}`}
      onClick={() => handleSelect()}
    >
      <div className={styles.imgDiv}>
        <img src={user.photoURL} alt="profile" />
      </div>
      <div className={styles.userData}>
        <p className={styles.displayName}>{user.displayName}</p>
        <p>
          <small>{lastMessage}</small>
        </p>
      </div>
    </div>
  );
};

export default User;
