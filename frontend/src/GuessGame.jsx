import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/game-results/";
const MAX_ATTEMPTS = 7;

const randomNumber = () => Math.floor(Math.random() * 100) + 1;

function GuessGame() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [secret, setSecret] = useState(0);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState("");
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const loadResults = () =>
    axios
      .get(API)
      .then((res) => setResults(res.data))
      .catch(() => setError("Не удалось загрузить результаты"));

  // GET при загрузке страницы
  useEffect(() => {
    loadResults();
  }, []);

  // «Начать игру» и «Начать заново»
  const startGame = () => {
    if (!name.trim()) {
      setError("Введите имя");
      return;
    }
    setError("");
    setSecret(randomNumber());
    setGuess("");
    setAttempts(0);
    setHint("");
    setFinished(false);
    setStarted(true);
  };

  // POST после окончания игры
  const finishGame = async (result, finalAttempts) => {
    setFinished(true);
    try {
      await axios.post(API, {
        player_name: name.trim(),
        attempts: finalAttempts,
        result: result,
      });
      loadResults();
    } catch {
      setError("Не удалось отправить результат");
    }
  };

  const handleGuess = () => {
    const num = Number(guess);
    if (!guess || num < 1 || num > 100) {
      setHint("Введите число от 1 до 100");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setGuess("");

    if (num === secret) {
      setHint("Угадано 🎉");
      finishGame("win", newAttempts);
    } else if (newAttempts >= MAX_ATTEMPTS) {
      setHint(`Попытки закончились 😢 Было загадано ${secret}`);
      finishGame("lose", newAttempts);
    } else {
      setHint(num < secret ? "Число больше ⬆️" : "Число меньше ⬇️");
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "40px auto" }}>
      <h2>🎮 Угадай число (1–100)</h2>

      {!started ? (
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Твоё имя"
          />
          <button onClick={startGame}>Начать игру</button>
        </div>
      ) : (
        <div>
          <p>Игрок: <b>{name}</b></p>
          <p>Попытки: {attempts} / {MAX_ATTEMPTS}</p>

          {!finished && (
            <div>
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Твоё число"
              />
              <button onClick={handleGuess}>Проверить</button>
            </div>
          )}

          {hint && <p style={{ fontSize: 18 }}>{hint}</p>}

          <button onClick={startGame}>Начать заново</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />
      <h3>Результаты</h3>
      {results.length === 0 ? (
        <p>Пока нет результатов</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Игрок</th>
              <th>Попытки</th>
              <th>Результат</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.player_name}</td>
                <td>{r.attempts}</td>
                <td>{r.result === "win" ? "🏆 win" : "❌ lose"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GuessGame;
