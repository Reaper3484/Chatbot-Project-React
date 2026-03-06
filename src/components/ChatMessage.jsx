import BotProfileImage from '../assets/bot.png'
import UserProfileImage from '../assets/user.png'
import SpinnerImage from '../assets/spinner.png'
import './ChatMessage.css'

export function ChatMessage({ message, sender, loading }) {
    const isBot = sender === "bot"

    return (
        <div className={isBot ? "chat-message-bot" : "chat-message-user"}>
            {isBot && (
                <img src={BotProfileImage} className="chat-message-profile" />
            )}

            {loading ? (
                <div className="loading-container">
                    <img className="loading-img" src={SpinnerImage} />
                </div>
            ) : (
                <div className="chat-message-text">
                    {message}
                </div>
            )}

            {!isBot && (
                <img src={UserProfileImage} className="chat-message-profile" />
            )}

        </div>
    )
}