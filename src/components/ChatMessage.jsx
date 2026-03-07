import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import BotProfileImage from '../assets/bot.png'
import UserProfileImage from '../assets/user.png'
import SpinnerImage from '../assets/spinner.png'
import './ChatMessage.css'

function formatChatTime(timestamp) {
    const messageDate = new Date(timestamp)
    const now = new Date()

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const messageDay = new Date(
        messageDate.getFullYear(),
        messageDate.getMonth(),
        messageDate.getDate()
    )

    const time = messageDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    })

    if (messageDay.getTime() === today.getTime()) {
        return time
    }

    if (messageDay.getTime() === yesterday.getTime()) {
        return `Yesterday ${time}`
    }

    const date = messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric"
    })

    return `${date} ${time}`
}

export function ChatMessage({ message, sender, loading, time, isLastMessage, regenerateResponse, editResponse, removing }) {
    const isBot = sender === "bot"
    const timeString = formatChatTime(time)

    return (
        <div className={`${isBot ? "chat-message-bot" : "chat-message-user"} ${removing ? "is-removing" : ""}`}>
            {isLastMessage && !isBot && (
                <button
                    onClick={editResponse}
                    className='edit-button'>
                    ✏️
                </button>
            )}

            {isBot && (
                <img src={BotProfileImage} className="chat-message-profile" />
            )}

            {loading ? (
                <div className="loading-container">
                    <img className="loading-img" src={SpinnerImage} />
                </div>
            ) : (
                <div className="chat-message-text">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </ReactMarkdown>

                    <div className='time'>{timeString}</div>
                </div>
            )}

            {!isBot && (
                <img src={UserProfileImage} className="chat-message-profile" />
            )}

            {isLastMessage && isBot && (
                <button
                    onClick={regenerateResponse}
                    className='retry-button'>
                    🔄️
                </button>
            )}
        </div>
    )
}