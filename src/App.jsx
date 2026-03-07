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

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(chatMessages))
  }, [chatMessages])

  return (
    <div className="app-container">
      {chatMessages.length === 0
        ? <p className="welcome-text">Welcome to the Chatbot project! Send a message by using the textbox below!</p>
        : null}

      <ChatMessages chatMessages={chatMessages}
        setShowScrollButton={setShowScrollButton} />

      <ChatInput setChatMessages={setChatMessages}
        showScrollButton={showScrollButton} />
    </div>
  )
}

export default App
