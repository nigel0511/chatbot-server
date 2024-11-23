import OpenAI from "openai";
import { config } from "dotenv";

config();
// Assign API key to variable
const apiKey = process.env.VITE_OPEN_AI_KEY;
// Initialise OpenAI API
export const openai = new OpenAI({ apiKey: apiKey });
