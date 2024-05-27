import React, { useEffect, useState } from 'react'

import AddUser from "./addUser/addUser"

import "./chatList.css"
import { useUserStore } from '../../../lib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  // [TODO]: specify type
  const { currentUser }: any = useUserStore();
  const { chatId, changeChat }: any = useChatStore();

  useEffect(() => {

    // [TODO]: specify type
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res: any) => {
      const items = res.data().chats;

      // [TODO]: specify type
      const promises = items.map(async (item: any) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...item, user }
      })

      // [TODO]: specify type
      const chatData = await Promise.all(promises) as any;

      // PS: kill me :( 
      // [TODO]: specify type
      setChats(chatData.sort((a: any, b: any) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    }
  }, [currentUser.id]);

  // TODO: specify any type
  const handleSelect = async (chat: any) => {
    const userChats = chats.map((item: any) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex((item: any) => item.chatId === chat.chatId);

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      })

      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  }

  // TODO: specify any type
  const filteredChats = chats.filter((c: any) => c.user.username.toLowerCase().includes(input.toLowerCase()));

  return (
    <>
      <div className="chatList">
        <div className="search">
          <div className="searchBar">
            <img src="./search.png" alt="" />
            <input type="text" placeholder="Search" onChange={e => setInput(e.target.value)} />
          </div>
          <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add" onClick={() => setAddMode((prev) => !prev)} />
        </div>
        {/* [TODO]: specify type */}
        {filteredChats.map((chat: any) => (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="" />
            <div className="texts">
              <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      {addMode && <AddUser />}
    </>
  )
}

export default ChatList
