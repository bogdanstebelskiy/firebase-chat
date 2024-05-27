import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  // TODO: specify any type
  changeChat: (chatId: string, user: any) => {
    const currentUser = useUserStore.getState().currentUser;
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      })
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      })
    } else {

      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      })
    }
  },
  toggleBlock: () => {
    // TODO: specify any type
    set((state: any) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }))
  }

}));
