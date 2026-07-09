import { createContext, useReducer } from "react";

export const ChatContext = createContext();

const INITIAL_STATE = {
  chatId: null,
  user: {},
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_USER":
      return {
        user: action.payload.selectedUser,
        chatId:
          action.payload.currentUser.uid > action.payload.selectedUser.uid
            ? action.payload.currentUser.uid + action.payload.selectedUser.uid
            : action.payload.selectedUser.uid + action.payload.currentUser.uid,
      };
    default:
      return state;
  }
};

export const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
