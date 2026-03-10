# AI Chatbot — React + Node + Gemini

A full-stack AI chatbot web application with a polished conversational UI, streaming responses, message editing, regeneration, and persistent chat history.

This project explores building a modern LLM-powered chat interface from scratch using **React**, **Node.js**, and **Google's Gemini API**, with a focus on clean architecture, smooth user experience, and real-time response handling.

---

## Overview

This project implements a conversational AI interface similar to modern chat assistants. The frontend provides a responsive chat UI with markdown rendering and animated responses, while the backend communicates with the Gemini API and manages conversation history.

A key design goal of this project is **controlled streaming**: responses are streamed from the AI model but displayed through a paced typing animation, allowing the UI to remain smooth and readable while still benefiting from reduced latency.

---

## Features

### Conversational Interface

* Interactive chatbot UI built with React
* Message bubbles with timestamps
* Smooth scrolling and scroll-to-bottom controls
* Responsive layout

### AI Integration

* Gemini API integration via Node.js backend
* Conversation history maintained for contextual responses
* Configurable message window to manage token usage

### Streaming Response System

* Streaming responses from Gemini through the backend
* Frontend buffering system to accumulate streamed text
* Controlled typing animation that consumes the buffer

This architecture allows:

* faster response start times
* smoother UI rendering
* consistent animation pacing

### Message Editing

Users can edit their previous message and regenerate the response.

Workflow:

1. Remove the last user/AI pair
2. Restore the edited message to the input field
3. Resubmit the modified prompt

### Response Regeneration

Users can regenerate the latest AI response without modifying the original message.

### Markdown Rendering

Responses support:

* Markdown formatting
* GitHub-style markdown extensions
* code blocks

Implemented with:

* `react-markdown`
* `remark-gfm`

### Persistent Chat History

Chat messages are stored in `localStorage` so conversations persist across page refreshes.

### Error Handling

The application includes structured error handling across both frontend and backend:

Frontend:

* network error detection
* API failure detection
* graceful UI fallback messages

Backend:

* request validation
* Gemini API error classification
* detailed server logs for debugging

### Docker Support

The application can run fully containerized using Docker.

The container serves both:

* the React frontend
* the Node.js API server

---

## Tech Stack

### Frontend

* React (Vite)
* React Hooks
* react-markdown
* remark-gfm
* CSS

### Backend

* Node.js
* Express
* Google Generative AI SDK

### Infrastructure

* Docker
* Docker Compose

---

## Project Structure

```
chatbot-project
│
├ backend
│   ├ index.js
│   ├ package.json
│   └ .env
│
├ src
│   ├ components
│   │   ├ ChatInput.jsx
│   │   └ ChatMessages.jsx
│   │
│   └ App.jsx
│
├ public
├ dist
│
├ Dockerfile
├ docker-compose.yml
├ docker-compose.prod.yml
└ .dockerignore
```

---

## How Streaming Works

The system implements a **producer–consumer streaming architecture**.

```
Gemini API
   ↓
Backend streaming (Express)
   ↓
Frontend stream reader
   ↓
Stream buffer
   ↓
Typing animation (typeLoop)
   ↓
UI message rendering
```

### Why This Approach?

Directly streaming tokens to the UI often results in uneven rendering because AI token generation can be bursty.

This project solves that by introducing a **stream buffer**:

1. The backend streams AI tokens to the frontend
2. The frontend accumulates them in a buffer
3. A controlled typing animation consumes the buffer

This provides:

* early response start
* smooth text animation
* stable rendering for markdown content

---

## Conversation Memory

To maintain context while controlling token usage, the backend sends only the most recent messages to the model.

Current implementation:

```
last 21 messages
```

This ensures conversation turn alignment:

```
user → bot → user → bot ...
```

while keeping requests efficient.

---

## Running the Project

### 1. Clone the repository

```
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

Backend:

```
cd backend
npm install
```

Frontend:

```
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `backend` directory:

```
GEMINI_API_KEY=your_api_key_here
```

---

### 4. Run the development server

Start the backend:

```
node backend/index.js
```

Start the frontend:

```
npm run dev
```

---

## Running with Docker

Build the container:

```
docker build -t chatbot .
```

Run the container:

```
docker run -p 5000:5000 --env-file backend/.env chatbot
```

The server will be available at:

```
http://localhost:5000
```

---

## Current Capabilities

* full stack chatbot
* AI streaming pipeline
* animated message rendering
* markdown and code formatting
* conversation editing
* response regeneration
* persistent chat history
* structured error handling
* containerized deployment

---

## Future Improvements

Planned improvements include:

* syntax highlighting for code blocks
* copy buttons for code snippets
* chat conversation sidebar
* automatic conversation titles
* streaming UI enhancements
* improved mobile layout
* cleaner frontend architecture using custom hooks

---

## Purpose of the Project

This project serves as a practical exploration of building modern AI interfaces, including:

* frontend streaming pipelines
* LLM conversation memory handling
* real-time UI feedback systems
* full-stack integration with AI models

It demonstrates how a conversational interface can be built from the ground up while maintaining clean engineering practices and extensibility.

---

## License

This project is provided for educational and experimental purposes.

