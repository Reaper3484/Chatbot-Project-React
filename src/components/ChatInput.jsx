import { useState } from "react"
import { Chatbot } from 'supersimpledev'
import './ChatInput.css'
import BackToBottomArrow from "./BackToBottomArrow"

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
                    id: crypto.randomUUID()
                },
                {
                    message: "...",
                    sender: "bot",
                    loading: true,
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
                        id: crypto.randomUUID()
                    }
                ]
            })

            setBotThinking(false)
        }
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
            <BackToBottomArrow visible={showScrollButton} setChatMessages={setChatMessages}/>
            <button className="send-button" disabled={botThinking} onClick={sendMessage}>Send</button>
        </div>
    )
}