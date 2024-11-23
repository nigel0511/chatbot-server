import { NextFunction, Request, Response } from "express";
import User from "../model/userModel";
import { openai } from "../config/openai";

// Define the IChat interface
interface IChat {
  role: string;
  content: string;
}

export const generateChatCompletion = async (
  req: Request<{ message: string }>,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

    // grab chats of user
    user.chats.push({ content: message, role: "user" } as IChat);

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    user.chats.push({
      content: chatResponse.choices[0].message.content,
      role: "assistant",
    });
    await user.save();
    res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
    }
    res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
