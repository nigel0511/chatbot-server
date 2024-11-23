import { Router } from "express";
import { chatCompletionValidator, validate } from "../utils/validators";
import {
  deleteChats,
  generateChatCompletion,
  sendChatsToUser,
} from "../controller/chatController";
import { verifyToken } from "../utils/token-manager";

//Protected API
const chatRouter = Router();
chatRouter.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);
chatRouter.get("/all-chats", verifyToken, sendChatsToUser);
chatRouter.delete("/delete", verifyToken, deleteChats);

export default chatRouter;
