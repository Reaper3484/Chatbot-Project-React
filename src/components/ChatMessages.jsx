import { useRef, useEffect } from "react"
import { ChatMessage } from "./ChatMessage"
import './ChatMessages.css'


function useAutoScroll(dependecyArray, autoScrolling) {
    const elemRef = useRef(null)
    const firstRender = useRef(true)

    useEffect(() => {
        const containerElm = elemRef.current

        if (!containerElm) return 

        autoScrolling.current = true

        if (firstRender.current) {
            containerElm.scrollTop = containerElm.scrollHeight
            firstRender.current = false
        } else {
            containerElm.scrollTo({
                top: containerElm.scrollHeight,
                behavior: "smooth"
            })
        }
    }, dependecyArray)

    return elemRef
}

function ChatMessages({ chatMessages, setShowScrollButton, regenerateResponse }) {
    const chatMessagesCards = chatMessages.map((chatMessage, index) => {
        const isLastBotMessage =
            index === chatMessages.length - 1
            && !chatMessage.loading
            && chatMessage.sender === 'bot'

        return (
            <ChatMessage message={chatMessage.message}
                sender={chatMessage.sender}
                loading={chatMessage.loading}
                time={chatMessage.time}
                isLastMessage={isLastBotMessage}
                regenerateResponse={regenerateResponse}
                key={chatMessage.id} />
        )
    })

    const autoScrolling = useRef(false)
    const elemRef = useAutoScroll([chatMessages], autoScrolling)

    function handleScroll(ev) {
        const el = ev.currentTarget

        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100

        if (autoScrolling.current && isAtBottom) {
            autoScrolling.current = false
        }

        if (!autoScrolling.current) {
            setShowScrollButton(!isAtBottom)
        }
    }


    return (
        <div className="chat-messages-container"
            ref={elemRef}
            onScroll={handleScroll}>
            {chatMessagesCards}
        </div>
    )
}

export default ChatMessages