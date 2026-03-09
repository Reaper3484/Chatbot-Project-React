import { useEffect, useState } from 'react'
import ChatMessages from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'
import './App.css'


function App() {
  const [chatMessages, setChatMessages] = useState(() => {
    const messages = JSON.parse(localStorage.getItem('messages')) || []

    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.loading) {
      lastMessage.loading = false
      lastMessage.message = "⚠️ Message failed to load"
    }

    return messages
  })

  const [showScrollButton, setShowScrollButton] = useState(false)
  const [botThinking, setBotThinking] = useState(false)
  const [draftMessage, setDraftMessage] = useState("")

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(chatMessages))
  }, [chatMessages])

  async function sendMessage(inputText, baseMessages = chatMessages) {

    if (botThinking) return
    if (!inputText.trim()) return

    setBotThinking(true)

    setChatMessages(prev => [
      ...prev,
      {
        message: inputText,
        sender: "user",
        loading: false,
        time: Date.now(),
        removing: false,
        id: crypto.randomUUID()
      },
      {
        message: "...",
        sender: "bot",
        loading: true,
        time: Date.now(),
        removing: false,
        id: crypto.randomUUID()
      }
    ])

    const updatedMessages = [
      ...baseMessages,
      {
        message: inputText,
        sender: "user",
        loading: false
      }
    ]

    let streamBuffer = ""
    let streamFinished = false

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages
        })
      })

      if (!response.ok) {
        throw new Error("SERVER_ERROR")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      async function readStream() {

        try {

          while (true) {

            const { done, value } = await reader.read()

            if (done) break

            streamBuffer += decoder.decode(value, { stream: true })

          }

        } catch (err) {

          console.error("🔥 Stream read error", err)

        } finally {

          streamFinished = true

        }
      }

      readStream()

    } catch (error) {

      console.error("⚠️ sendMessage error")
      console.error(error)

      let errorMessage = "⚠️ Message failed to load"

      if (error.message === "GEMINI_OVERLOAD") {
        errorMessage = "⚠️ AI service busy. Try again."
      }

      if (error.message === "NETWORK_ERROR") {
        errorMessage = "⚠️ Network error."
      }

      setBotThinking(false)

      setChatMessages(prev => {
        const oldArray = prev.slice(0, -1)

        return [
          ...oldArray,
          {
            message: errorMessage,
            sender: "bot",
            loading: false,
            time: Date.now(),
            removing: false,
            id: crypto.randomUUID()
          }
        ]
      })

      return
    }

    setChatMessages(prev => {
      const oldArray = prev.slice(0, -1)
      return [
        ...oldArray,
        {
          message: "",
          sender: "bot",
          loading: false,
          time: Date.now(),
          removing: false,
          id: crypto.randomUUID()
        }
      ]
    })

    let printedWords = 0

    function typeLoop() {

      const words = streamBuffer.split(" ")

      if (printedWords < words.length) {

        const chunkSize = 5 + Math.floor(Math.random() * 3)

        printedWords = Math.min(
          printedWords + chunkSize,
          words.length
        )

        const visibleWords = words.slice(0, printedWords)

        setChatMessages(prev => {
          const updated = [...prev]

          updated[updated.length - 1].message =
            visibleWords.join(" ")

          return updated
        })

      }

      if (!streamFinished || printedWords < words.length) {

        const delay = 100 + Math.random() * 100

        setTimeout(typeLoop, delay)

      } else {

        setBotThinking(false)

      }
    }

    typeLoop()
  }

  function scrollToBottom() {
    setChatMessages(prev => [...prev])
  }

  function clearStorage() {
    setChatMessages([])
    localStorage.clear()
  }

  function regenerateResponse() {
    const trimmedMessages = chatMessages.slice(0, -2)
    const userMessage = chatMessages.at(-2)
    setChatMessages(trimmedMessages)
    sendMessage(userMessage.message, trimmedMessages)
  }

  function editResponse() {
    const userMessage = chatMessages.at(-2)

    setChatMessages(prev =>
      prev.map((msg, i) => {
        if (i >= prev.length - 2) {
          return { ...msg, removing: true }
        }
        return msg
      })
    )

    setTimeout(() => {
      setChatMessages(prev => prev.slice(0, -2))
      setDraftMessage(userMessage.message)
    }, 250);
  }

  return (
    <div className="app-container">
      {chatMessages.length === 0
        ? <p className="welcome-text">Welcome to the Chatbot project! Send a message by using the textbox below!</p>
        : null}

      <ChatMessages chatMessages={chatMessages}
        regenerateResponse={regenerateResponse}
        editResponse={editResponse}
        setShowScrollButton={setShowScrollButton} />

      <ChatInput
        sendMessage={sendMessage}
        botThinking={botThinking}
        scrollToBottom={scrollToBottom}
        clearStorage={clearStorage}
        draftMessage={draftMessage}
        showScrollButton={showScrollButton} />
    </div>
  )
}

export default App
