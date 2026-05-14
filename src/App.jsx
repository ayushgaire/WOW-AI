import { useEffect, useRef, useState } from "react"
import { askAI } from "./gemini"
import "./App.css"
import logo from "./assets/logo.png"

function App() {

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [count, setCount] = useState(0)
  const [placeholder, setPlaceholder] = useState("Ask anything...")
  const [theme, setTheme] = useState("dark")
  const [favorite, setFavorite] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const answerRef = useRef(null)

  useEffect(() => {

    const placeholders = [
      "Ask anything...",
      "Tell me a joke...",
      "Explain AI...",
      "Motivate me...",
      "Write code..."
    ]

    let index = 0

    const interval = setInterval(() => {

      index = (index + 1) % placeholders.length

      setPlaceholder(placeholders[index])

    }, 2500)

    return () => clearInterval(interval)

  }, [])

  const getGreeting = () => {

    const hour = new Date().getHours()

    if (hour < 12) return "Good Morning ☀️"
    if (hour < 18) return "Good Afternoon 🌤️"

    return "Good Evening 🌙"

  }

  const handleAsk = async () => {

    if (!question) return

    setLoading(true)

    setAnswer("")

    try {

      const response = await askAI(question)

      setAnswer(response)

      setCount((prev) => prev + 1)

      setHistory((prev) => [
        question,
        ...prev
      ])

    } catch (error) {

      console.log(error)

      setAnswer("Error connecting to AI")

    }

    setLoading(false)

  }

  const copyAnswer = () => {

    navigator.clipboard.writeText(answer)

    alert("Answer copied!")

  }

  const downloadAnswer = () => {

    const element = document.createElement("a")

    const file = new Blob([answer], {
      type: "text/plain"
    })

    element.href = URL.createObjectURL(file)

    element.download = "wow-ai-response.txt"

    document.body.appendChild(element)

    element.click()

  }

  const startVoice = () => {

    const recognition =
      new window.webkitSpeechRecognition()

    recognition.onresult = (event) => {

      setQuestion(
        event.results[0][0].transcript
      )

    }

    recognition.start()

  }

  const randomQuestion = () => {

    const randomQuestions = [
      "Tell me a joke",
      "Explain React",
      "Motivate me",
      "Write a poem",
      "Explain AI"
    ]

    const random =
      randomQuestions[
        Math.floor(
          Math.random() *
          randomQuestions.length
        )
      ]

    setQuestion(random)

  }

  return (

    <div className={`app ${theme}`}>

      <img
        src={logo}
        alt="WOW AI Logo"
        className="logo"
      />

      <h1>WOW AI ✨</h1>

      <p className="greeting">
        {getGreeting()}
      </p>

      <p className="subtitle">
        Your smart AI assistant
      </p>

      <p className="status">
        🟢 WOW AI Online
      </p>

      <div className="top-buttons">

        <button
          onClick={() =>
            setTheme(
              theme === "dark"
                ? "light"
                : "dark"
            )
          }
        >
          {theme === "dark"
            ? "☀️ Light"
            : "🌙 Dark"}
        </button>

        <button onClick={startVoice}>
          🎤 Speak
        </button>

      </div>

      <div className="suggestions">

        <button
          onClick={() =>
            setQuestion("Tell me a joke")
          }
        >
          Joke
        </button>

        <button
          onClick={() =>
            setQuestion("Explain AI")
          }
        >
          AI
        </button>

        <button
          onClick={() =>
            setQuestion("Motivate me")
          }
        >
          Motivation
        </button>

      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }

        onKeyDown={(e) => {

          if (e.key === "Enter") {

            handleAsk()

          }

        }}
      />

      <p className="counter">
        {question.length} characters
      </p>

      <div className="buttons">

        <button onClick={handleAsk}>
          Ask AI
        </button>

        <button
          className="clear-btn"
          onClick={() => {
            setQuestion("")
            setAnswer("")
          }}
        >
          Clear
        </button>

        <button
          className="copy-btn"
          onClick={copyAnswer}
        >
          Copy
        </button>

        <button
          className="random-btn"
          onClick={randomQuestion}
        >
          Random
        </button>

        <button
          className="download-btn"
          onClick={downloadAnswer}
        >
          Download
        </button>

        <button
          className="favorite-btn"
          onClick={() =>
            setFavorite(answer)
          }
        >
          ⭐ Favorite
        </button>

      </div>

      <div
        className="answer-box"
        ref={answerRef}
      >

        {

          loading ? (

            <div className="loader"></div>

          ) : (

            <>
              <p>{answer}</p>

              <small>
                {new Date().toLocaleString()}
              </small>
            </>

          )

        }

      </div>

      {

        favorite && (

          <div className="favorite-box">

            <h3>
              ⭐ Favorite Response
            </h3>

            <p>{favorite}</p>

          </div>

        )

      }

      <div className="history-box">

        <div className="history-top">

          <h3>🕘 History</h3>

          <button
            className="delete-history"
            onClick={() =>
              setHistory([])
            }
          >
            Delete
          </button>

        </div>

        {

          history.map((item, index) => (

            <p key={index}>
              • {item}
            </p>

          ))

        }

      </div>

      <p className="usage">
        Questions Asked: {count}
      </p>

      <footer className="footer">
        © 2026 All Rights Reserved to Codyza.com by Ayush Gaire
      </footer>

    </div>

  )

}

export default App