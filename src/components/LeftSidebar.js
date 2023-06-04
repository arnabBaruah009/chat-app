import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";

import styles from "../styles/leftsidebar.module.css";
import { User } from "./";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const LeftSideBar = ({ user, handleClick }) => {
  const [users, setUsers] = useState([]);
  const [users2, setUsers2] = useState([]);
  const [search, setSearch] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const unsubscribe = await onSnapshot(
        collection(db, "users"),
        (querySnapshot) => {
          const fetchedUsers = [];
          querySnapshot.forEach((doc) => {
            if (doc.data().uid !== currentUser.uid) {
              fetchedUsers.push(doc.data());
            }
          });
          setUsers(fetchedUsers);
          setUsers2(fetchedUsers);
        }
      );
      return () => {
        unsubscribe();
      };
    };
    fetchUsers();
  }, []);

  const handleSearch = (data) => {
    setSearch(data);
    if (data === "") {
      setUsers2(users);
      return;
    }
    let searchUsers = users.filter((user) => user.displayName.includes(search));
    setUsers2(searchUsers);
  };

  return (
    <div className={styles.leftContainer}>
      {/* <div>{currentUser.displayName}</div> */}
      <div className={styles.searchBar}>
        <label for="search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
          <input
            required=""
            autocomplete="off"
            placeholder="search your chats"
            id="search"
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.conversationList}>
        <div className={styles.header}>
          <span>CONVERSATIONS</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
          </svg>
        </div>

        {users2.map((userA) => {
          if (user.uid === userA.uid) {
            return (
              <User
                user={userA}
                handleClick={handleClick}
                active={true}
                key={userA.uid}
              />
            );
          } else {
            return (
              <User user={userA} handleClick={handleClick} key={userA.uid} />
            );
          }
        })}
      </div>
    </div>
  );
};

export default LeftSideBar;
