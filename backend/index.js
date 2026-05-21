import express from "express"
import dotenv from "dotenv"
import authRoutes from "./src/routes/auth.route.js"
import messageRoutes from "./src/routes/message.route.js"
import cookieParser from "cookie-parser"
import { db } from "./src/lib/db.js";
import { app,server } from "./src/lib/socket.js"
import cors from "cors"
import aiRoutes from "./src/routes/ai.route.js";
dotenv.config();
const PORT= process.env.PORT || 3000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())
app.use(cors({
origin: [
  'http://localhost:5173',
  'https://chat-app-n5oz34cjk-palakkwadhwas-projects.vercel.app'
],
  credentials: true
}));
const predefinedQA = [
  { question: "What services do you offer?", answer: "We provide AI automation, chatbot integration, and data scraping solutions." },
  { question: "How can I contact support?", answer: "You can reach us at support@example.com." },
  { question: "What is your pricing model?", answer: "Our pricing is flexible and depends on the service package you choose." },
  { question: "What is your business model?", answer: "We provide Fintech services" },
];
app.get('/api/questions', (req, res) => {
  res.json(predefinedQA);
});
app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
app.use("/api/ai", aiRoutes);
server.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
    db()
})