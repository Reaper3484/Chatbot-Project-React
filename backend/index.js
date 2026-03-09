import express from 'express'
import dotenv from 'dotenv'
import path from "path"
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.static(path.join(process.cwd(), "../dist")))

const PORT = 5000

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview"
})

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), "../dist", "index.html"))
})

app.post("/chat", async (req, res) => {

  const { messages } = req.body

  try {
    const lastMessages = messages.slice(-20)

    const history = lastMessages.slice(0, -1).map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.message }]
    }))

    const chat = model.startChat({
      history
    })

    const result = await chat.sendMessage(lastMessages.at(-1).message)

    const reply = result.response.text()

    res.json({ reply })

  } catch (err) {

    console.error(err)

    res.status(500).json({ reply: "Something went wrong." })
  }
})

app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`) })