import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

import EmojiPicker, { EmojiClickData } from "emoji-picker-react"

import { onSnapshot, doc, arrayUnion, updateDoc, getDoc } from "firebase/firestore";
import "./chat.css"
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  // TODO: specify any type
  const [img, setImg] = useState<any>({
    file: null,
    url: "",
  })

  // TODO specify any type
  const { currentUser }: any = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked }: any = useChatStore();

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [])

  useEffect(() => {
    // TODO: specify any type
    const unSub = onSnapshot(doc(db, "chats", chatId), (res: any) => {
      setChat(res.data())
    })

    return () => {
      unSub();
    }
  }, [chatId]);

  const handleImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    setImg({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0])
    })
  }

  const handleEmoji = (e: EmojiClickData) => {
    setText(prev => prev + e.emoji);
    setOpen(false);
  }

  const handleSend = async () => {
    if (!text) {
      return;
    }

    // TODO: specify any type
    let imgUrl: any = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        })
      })

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id: any) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          // TODO: specify any type
          const chatIndex = userChatsData.chats.findIndex((c: any) => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      })
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: ""
    });

    setText("");
  }


  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem qui minim labore adipisicing.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {
          // TODO: specify any type
          chat?.messages?.map((message: any) => (
            <div className={message.senderId.id === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
              <div className="texts">
                {message.img && <img src={message.img} />}
                <p>
                  {message.text}
                </p>
                <span>1 min ago</span>
              </div>
            </div>
          ))
        }
        {
          img.url && <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        }
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" placeholder={((isCurrentUserBlocked || isReceiverBlocked) ? "You can't send a message!" : "Type a message...")} value={text} onChange={e => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked} />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(prev => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div >
  )
}

export default Chat
