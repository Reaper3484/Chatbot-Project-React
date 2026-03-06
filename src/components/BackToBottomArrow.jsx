import './BackToBottomArrow.css'

function BackToBottomArrow({ setChatMessages, visible }) {
    function scrollToBottom() {
        setChatMessages(prev => [...prev])
    }

    return (
        <>
            <button
                onClick={scrollToBottom}
                className={`arrow-container ${visible ? "arrow-visible" : "arrow-hidden"}`}>⬇️</button>
        </>
    )
}

export default BackToBottomArrow