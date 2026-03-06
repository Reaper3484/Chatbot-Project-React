import { useState } from 'react'
import ChatMessages from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'
import './App.css'


function App() {
  const [chatMessages, setChatMessages] = useState([])
  const [showScrollButton, setShowScrollButton] = useState(false)

  return (
    <div className="app-container">
      {chatMessages.length == 0
        ? <p className="welcome-text">Welcome to the Chatbot project! Send a message by using the textbox below!</p>
        : null}

      <ChatMessages chatMessages={chatMessages}
        showScrollButton={showScrollButton}
        setShowScrollButton={setShowScrollButton} />
      <ChatInput setChatMessages={setChatMessages}
        showScrollButton={showScrollButton}
        setShowScrollButton={setShowScrollButton} />
    </div>
  )
}

export default App
