import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState("chat_gpt");
  const [search_service, setSearchService] = useState("elastic");
  const navigate = useNavigate();

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = question;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setQuestion("");

    try {
      const res = await axios.post("https://back-brs4.onrender.com/ask", {
        question: userMessage,
        model: model,
        search_service: search_service
      });

      const { answer, docs } = res.data;

      const formattedAnswer = `${answer}\n\n(Источники: ${docs.join(", ")})\n\nМодель: ${model} \n\nСистема поиска: ${search_service}`;

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: formattedAnswer },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Произошла ошибка при запросе к серверу." },
      ]);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full flex flex-col">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          AI Вопросник
        </h1>

        {/* Окно диалога */}
        <div
          className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 flex flex-col"
          style={{ minHeight: "300px", maxHeight: "400px" }}
        >
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">
              Задайте вопрос, чтобы начать диалог
            </p>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 max-w-[70%] p-3 rounded-xl ${
                msg.type === "user"
                  ? "bg-blue-600 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              <pre style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                margin: 0,
              }}>
                {msg.text}
              </pre>
            </div>
          ))}
        </div>

        {/* Поле ввода и кнопка */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Введите вопрос"
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="chat_gpt">ChatGPT</option>
            <option value="giga_chat">GigaChat</option>
            <option value="yandex_gpt">YandexGPT</option>
          </select>
          <select
            value={search_service}
            onChange={(e) => setSearchService(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="elastic">Elastic</option>
            <option value="gpt">Gpt</option>
          </select>
          <button
            onClick={handleAsk}
            className="bg-blue-600 w-full text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Спросить
          </button>
        </div>

        {/* Кнопка перехода на страницу загрузки */}
        <button
          onClick={() => navigate("/upload")}
          className="text-sm text-blue-500 hover:underline text-center"
        >
          Загрузить данные
        </button>
      </div>
    </div>
  );
}

export default App;
