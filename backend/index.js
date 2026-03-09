import express from 'express'
import dotenv from 'dotenv'
import path from "path"
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in environment")
  process.exit(1)
}

const app = express()

app.use(cors())
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

  if (!messages || !Array.isArray(messages)) {

    console.error("❌ Invalid request: messages missing or not array")

    return res.status(400).json({
      reply: "⚠️ Invalid request format.",
      error: {
        type: "INVALID_REQUEST",
        message: "messages must be an array"
      }
    })
  }

  if (messages.length === 0) {

    console.error("❌ Invalid request: empty messages array")

    return res.status(400).json({
      reply: "⚠️ No messages provided.",
      error: {
        type: "EMPTY_MESSAGES"
      }
    })
  }

  try {

    const lastMessages = messages.slice(-21)

    const history = lastMessages.slice(0, -1).map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.message }]
    }))

    const userPrompt = lastMessages.at(-1)?.message

    if (!userPrompt) {

      console.error("❌ Last message missing content")

      return res.status(400).json({
        reply: "⚠️ Last message was empty.",
        error: {
          type: "EMPTY_LAST_MESSAGE"
        }
      })
    }

    const chat = model.startChat({ history })

    res.setHeader("Content-Type", "text/plain")
    res.setHeader("Transfer-Encoding", "chunked")

    try {
      const result = await chat.sendMessageStream(userPrompt)

      for await (const chunk of result.stream) {
        const text = chunk.text()

        if (!text) continue

        res.write(text)
      }

      res.end()

    } catch (err) {

      console.error("⚠️ STREAM ERROR")
      console.error(err)

      if (!res.headersSent) {
        res.status(500).json({
          reply: "⚠️ Streaming failed.",
          error: { type: "STREAM_ERROR" }
        })
      } else {
        res.end()
      }
    }

    res.json({ reply })

  } catch (err) {

    console.error("⚠️️️️ CHAT ROUTE ERROR")
    console.error("Type:", err.name)
    console.error("Status:", err.status)
    console.error("Message:", err.message)
    console.error("Stack:", err.stack)

    // ---- Gemini specific errors ----

    if (err.status === 503) {
      return res.status(503).json({
        reply: "⚠️ AI service is under heavy load. Try again shortly.",
        error: {
          type: "GEMINI_OVERLOAD",
          status: 503,
          message: err.message
        }
      })
    }

    if (err.status === 401 || err.status === 403) {
      return res.status(500).json({
        reply: "⚠️ AI authentication error.",
        error: {
          type: "GEMINI_AUTH_ERROR",
          status: err.status
        }
      })
    }

    if (err.name === "FetchError") {
      return res.status(500).json({
        reply: "⚠️ Network error contacting AI service.",
        error: {
          type: "NETWORK_ERROR"
        }
      })
    }

    // ---- unknown error ----

    return res.status(500).json({
      reply: "⚠️ Internal server error.",
      error: {
        type: "UNKNOWN_SERVER_ERROR",
        message: err.message
      }
    })
  }
})

app.use((err, req, res, next) => {

  console.error("⚠️ UNHANDLED SERVER ERROR")
  console.error(err)

  res.status(500).json({
    reply: "⚠️ Unexpected server error.",
    error: {
      type: "UNHANDLED_ERROR"
    }
  })
})

app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`) })