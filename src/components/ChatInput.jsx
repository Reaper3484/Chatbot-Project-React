import { useState } from "react"
import { Chatbot } from 'supersimpledev'
import './ChatInput.css'

export function ChatInput({ setChatMessages, showScrollButton }) {
    const [inputText, setInputText] = useState('')
    const [botThinking, setBotThinking] = useState(false)

    function updateText(event) {
        setInputText(event.target.value)
    }

    async function sendMessage(event) {
        if (botThinking) return

        if (event.key == "Escape") {
            setInputText("")
            return
        }

        if (event.key == "Enter" || !event.key) {
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

            setInputText('')

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
    }

    function scrollToBottom() {
        setChatMessages(prev => [...prev])
    }

    function clearStorage() {
        setChatMessages([])
        localStorage.clear()
    }

    return (
        <div className="chat-input-container">
            <input
                placeholder="Send a message to ChatBot"
                size="30"
                onChange={updateText}
                onKeyDown={sendMessage}
                className="chat-input"
                value={inputText} />

            <button
                onClick={scrollToBottom}
                className={`arrow-container ${showScrollButton ? "arrow-visible" : "arrow-hidden"}`}>
                ⬇️
            </button>

            <button
                className={`send-button ${botThinking ? "button-disabled" : ""}`}
                onClick={sendMessage}
                disabled={botThinking}>
                Send
            </button>

            <button 
                className="clear-button"
                onClick={clearStorage}>
                Clear
            </button>
        </div>
    )
}