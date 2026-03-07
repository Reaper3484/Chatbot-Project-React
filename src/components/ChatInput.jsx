import { useState } from "react"
import './ChatInput.css'

export function ChatInput({ showScrollButton, sendMessage, botThinking, clearStorage, scrollToBottom }) {
    const [inputText, setInputText] = useState('')

    function updateText(event) {
        setInputText(event.target.value)
    }

    async function submitMessage() {
        if (botThinking) return
        if (!inputText.trim()) return
        sendMessage(inputText)
        setInputText("")
    }

    async function handleKeyDown(event) {
        if (event.key == "Escape") {
            setInputText("")
            return
        }

        if (event.key == "Enter") {
            submitMessage()
        }
    }

    return (
        <div className="chat-input-container">
            <input
                placeholder="Send a message to ChatBot"
                size="30"
                onChange={updateText}
                onKeyDown={handleKeyDown}
                className="chat-input"
                value={inputText} />

            <button
                onClick={scrollToBottom}
                className={`arrow-container ${showScrollButton ? "arrow-visible" : "arrow-hidden"}`}>
                ⬇️
            </button>

            <button
                className={`send-button ${botThinking ? "button-disabled" : ""}`}
                onClick={submitMessage}
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