import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL;
console.log("inside socket service", API_URL);
const socket = io(API_URL);

const subscribeToMessages = (callback) => {
  socket.on("message", (message) => {
    callback(message);
  });
};

const sendMessage = (message) => {
  socket.emit("message", message);
};

export { subscribeToMessages, sendMessage, socket };
