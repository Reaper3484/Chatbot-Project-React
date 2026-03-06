import { useRef, useEffect } from "react"
import { ChatMessage } from "./ChatMessage"
import './ChatMessages.css'


function useAutoScroll(dependecyArray, autoScrolling) {
    const elemRef = useRef(null)

    useEffect(() => {
        const containerElm = elemRef.current
        if (containerElm) {
            autoScrolling.current = true

            containerElm.scrollTo({
                top: containerElm.scrollHeight,
                behavior: "smooth"
            })
        }
    }, dependecyArray)

    return elemRef
}

function ChatMessages({ chatMessages, setShowScrollButton }) {
    const chatMessagesCards = chatMessages.map((chatMessage) => {
        return (
            <ChatMessage message={chatMessage.message}
                sender={chatMessage.sender}
                loading={chatMessage.loading}
                key={chatMessage.id} />
        )
    })

    const autoScrolling = useRef(false)
    const elemRef = useAutoScroll([chatMessages], autoScrolling)

    function handleScroll(ev) {
        const el = ev.currentTarget

        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5

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