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

    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedMessages
      })
    })

    const data = await response.json()

    const reply = data.reply
    const words = reply.split(" ")

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

    let index = 0
    let visibleWords = []

    function typeLoop() {

      if (index < words.length) {

        const chunkSize = 5 + Math.floor(Math.random() * 3)

        visibleWords = words.slice(0, index + chunkSize)

        setChatMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1].message = visibleWords.join(" ")
          return updated
        })

        index += chunkSize

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
