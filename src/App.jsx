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
              id: crypto.randomUUID()
          },
          {
              message: "...",
              sender: "bot",
              loading: true,
              time: Date.now(),
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

  return (
    <div className="app-container">
      {chatMessages.length === 0
        ? <p className="welcome-text">Welcome to the Chatbot project! Send a message by using the textbox below!</p>
        : null}

      <ChatMessages chatMessages={chatMessages}
        setShowScrollButton={setShowScrollButton} />

      <ChatInput 
        sendMessage={sendMessage}
        botThinking={botThinking}
        scrollToBottom={scrollToBottom}
        clearStorage={clearStorage}
        showScrollButton={showScrollButton} />
    </div>
  )
}

export default App
