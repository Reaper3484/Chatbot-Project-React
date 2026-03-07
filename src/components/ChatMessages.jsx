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

function ChatMessages({ chatMessages, setShowScrollButton, regenerateResponse, editResponse }) {
    const chatMessagesCards = chatMessages.map((chatMessage, index) => {
        const isLastMessage =
            index >= chatMessages.length - 2 
            && !chatMessage.loading

        return (
            <ChatMessage message={chatMessage.message}
                sender={chatMessage.sender}
                loading={chatMessage.loading}
                time={chatMessage.time}
                isLastMessage={isLastMessage}
                regenerateResponse={regenerateResponse}
                editResponse={editResponse}
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