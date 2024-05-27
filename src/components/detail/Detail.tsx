import React from 'react'

import "./detail.css"
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

const Detail = () => {
  // TODO: specify any type
  const { user, isCurrentUserBlocked, isReceiverBlocked, toggleBlock }: any = useChatStore();
  const { currentUser }: any = useUserStore();

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
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.redd.it/couldnt-find-a-good-hd-version-of-badmotorfinger-to-use-as-v0-cutf0bwk9mu91.png?width=1701&format=png&auto=webp&s=352a817f8ade9cf17cadd6f23e09afcd397fc48d" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.redd.it/couldnt-find-a-good-hd-version-of-badmotorfinger-to-use-as-v0-cutf0bwk9mu91.png?width=1701&format=png&auto=webp&s=352a817f8ade9cf17cadd6f23e09afcd397fc48d" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.redd.it/couldnt-find-a-good-hd-version-of-badmotorfinger-to-use-as-v0-cutf0bwk9mu91.png?width=1701&format=png&auto=webp&s=352a817f8ade9cf17cadd6f23e09afcd397fc48d" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://i.redd.it/couldnt-find-a-good-hd-version-of-badmotorfinger-to-use-as-v0-cutf0bwk9mu91.png?width=1701&format=png&auto=webp&s=352a817f8ade9cf17cadd6f23e09afcd397fc48d" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
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
  )
}

export default Detail
