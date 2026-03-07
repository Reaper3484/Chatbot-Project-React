import { useEffect, useState } from 'react'
import ChatMessages from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'
import { Chatbot } from 'supersimpledev'
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

  async function sendMessage(inputText) {
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

      const response = await Chatbot.getResponseAsync(inputText)

      setChatMessages(prev => {
          const oldArray = prev.slice(0, -1)
          return [
              ...oldArray,
              {
                  message: response,
                  sender: "bot",
                  loading: false,
                  time: Date.now(),
                  removing: false,
                  id: crypto.randomUUID()
              }
          ]
      })

      setBotThinking(false)
  }

  function scrollToBottom() {
      setChatMessages(prev => [...prev])
  }

  function clearStorage() {
      setChatMessages([])
      localStorage.clear()
  }

  function regenerateResponse() {
    const userMessage = chatMessages.at(-2)
    setChatMessages(prev => prev.slice(0, -2))
    sendMessage(userMessage.message)
  }

  function editResponse() {
    const userMessage = chatMessages.at(-2)

    setChatMessages(prev => 
      prev.map((msg, i) => {
        if (i >= prev.length - 2) {
          return {...msg, removing: true}
        }
        return msg
      })
    )

    setTimeout(() => {
      setChatMessages(prev => prev.slice(0, -2))
      setDraftMessage(userMessage.message)
      console.log("Deleted")
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
