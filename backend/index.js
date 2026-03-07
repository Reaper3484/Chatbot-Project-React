import express, { response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
})

app.post('/chat', async (req, res) => {
    const { message } = req.body

    try {

        const result = await model.generateContent(message)
        const response = result.response.text()

        res.json({ reply: response })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            reply: "Something went wrong!"
        })
    }

})

app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`) })