import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

import styles from "../styles/user.module.css";

const User = ({ user, handleClick, active }) => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSelect = async () => {
    handleClick(user);

    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedID));

      //if chats doesn't exists
      if (!res.exists()) {
        //create chats
        await setDoc(doc(db, "chats", combinedID), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedID + ".date"]: serverTimestamp()
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedID + ".date"]: serverTimestamp()
        });
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
        <p>{user.displayName}</p>
        <p>
          <small>{user.lastText}</small>
        </p>
      </div>
    </div>
  );
};

export default User;
