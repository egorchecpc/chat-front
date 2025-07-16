import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setStatus("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setStatus("Пожалуйста, выберите хотя бы один файл.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("https://back-brs4.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("Файлы успешно загружены!");
      setFiles([]);  // очищаем выбранные файлы после успешной загрузки
    } catch (err) {
      setStatus("Ошибка при загрузке файлов.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-blue-600 text-center">Загрузка данных</h2>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border border-gray-300 rounded-xl p-2"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
        >
          Загрузить файлы
        </button>

        {status && <p className="text-center text-sm text-gray-700">{status}</p>}

        <button
          onClick={() => navigate("/")}
          className="text-blue-600 underline text-sm mt-4"
        >
          ← Назад
        </button>
      </div>
    </div>
  );
}

export default UploadPage;
