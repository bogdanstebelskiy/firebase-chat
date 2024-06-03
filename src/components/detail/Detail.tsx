import React, { useEffect, useState } from 'react'

import "./detail.css"
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';

const Detail = () => {
  // TODO: specify any type
  const [chatImages, setChatImages]: any = useState([]);
  const { user, isCurrentUserBlocked, isReceiverBlocked, toggleBlock }: any = useChatStore();
  const { currentUser }: any = useUserStore();
  const { chatId }: any = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), async (res: any) => {
      const items = res.data().messages;

      const images: any = [];

      items.forEach((message: any) => {
        if (message.img) {
          images.push(message?.img);
        }
      })
      setChatImages(images);
    })

    return () => {
      unSub();
    }
  }, [])

  const handleBlock = async () => {
    if (!user) {
      return;
    }

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      toggleBlock();
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            {chatImages.map((image: any) => (
              <div className="photoItem">
                <div className="photoDetail">
                  <img src={`${image}`} />
                  <span>photo_2024_2.png</span>
                </div>
                <img src="./download.png" alt="" className="icon" />
              </div>
            ))}
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="buttons">
          <button className="block" onClick={handleBlock}>
            {/* TODO: Block messages doesn't always show up right! Fix!*/}
            {isCurrentUserBlocked ? "You are blocked" : (isReceiverBlocked ? "User is blocked" : "Block user")}
          </button>
          <button className="logout" onClick={() => auth.signOut()}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Detail
