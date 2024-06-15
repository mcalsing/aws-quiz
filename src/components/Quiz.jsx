import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TIMEFORTEST = 30*60;

const Loading = () => (
  <div className="h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center border-2 rounded-tr-[50%] rounded-bl-[50%]">
    <p className="text-xl text-gray-500">Loading...</p>
  </div>
);

// Utility function to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
  return formattedTime;
};

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(TIMEFORTEST);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [status, setStatus] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    fetch("/quiz.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching quiz data:", error));

    // Set up the timer interval
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        // Check if the timer is greater than 0 before decrementing
        return prevTimer > 0 ? prevTimer - 1 : prevTimer;
      });
    }, 1000);

    setTimerIntervalId(intervalId);

    return () => {
      clearInterval(intervalId);
      if (timer <= 0) {
        setShowResult(true);
      }
    };
  }, [timer]);

  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      // Lógica de conclusão do quiz (por exemplo, enviar quiz, mostrar resultados)
      setCurrentQuestionIndex(0); // Redefinir para a primeira pergunta
    }
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    // Handle answer selection logic here
    const updatedAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(updatedAnswers);
  };

/*   const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length -1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex +1);
    } else {
      alert(isButtonDisabled)
      setIsButtonDisabled(true);
    }
  } */

  const handleSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);

    clearInterval(timerIntervalId);

    // Calculate score and show result
    setTimeout(() => {
      const quizScore = calculateScore(answers);
      setScore(quizScore);
      const percentage = (quizScore / questions.length) * 100;
      // Determine the status based on the percentage
      const newStatus = percentage >= 50 ? "Passed" : "Failed";
      setStatus(newStatus);

      setShowResult(true);
      setLoading(false);
    }, 5000);
  };

  const calculateScore = (userAnswers) => {
    const correctAnswers = questions.map((question) => question.answer);
    let score = 0;
    for (const questionId in userAnswers) {
      if (userAnswers[questionId] === correctAnswers[questionId - 1]) {
        score++;
      }
    }
    return score;
  };

  // Reset states and reload the page
  const restartQuiz = () => {
    setAnswers({});
    setScore(0);
    setShowResult(false);
    setLoading(false);
    setTimer(TIMEFORTEST);
    navigate("/quiz");
  };

  return (
    <main>
      <div className="flex justify-center gap-1 pt-3">
        <p className="text-x1 text-slate-700">Tempo restante:</p>
        <h1 className="text-green-700" id="count">
          {formatTime(timer)}
        </h1>
      </div>
      <div className="w-[800px] flex md:flex-row flex-col mx-auto">
        {/* question section */}
        <div className="w-full text-slate-700">
          <div>
            {questions.length > 0 && (
              <div key={questions[currentQuestionIndex].id}
                className="m-3 py-3 px-4 border border-slate-400 rounded"
              >
                <p className="flex rounded text-xl p-2">
                  <span className="h-9 w-9 bg-sky-800 flex justify-center items-center text-slate-100 mr-3 p-3 rounded-full">
                    {questions[currentQuestionIndex].id}
                  </span>
                  <p className="text-justify">{questions[currentQuestionIndex].question}</p>
                </p>
                <div className="grid grid-cols-2 gap-4 mt-5">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div
                      className={`border border-gray-400 rounded p-5 cursor-pointer hover:bg-sky-800 hover:text-slate-300 
                        ${answers[questions[currentQuestionIndex].id] === option ? "bg-sky-800 text-slate-100" : ""}`}
                      key={option}
                      onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, option)}
                    >
                      <p>{option}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setCurrentQuestionIndex((prevIndex) => prevIndex + 1)}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`${(currentQuestionIndex === questions.length - 1) ? "text-slate-400" : "text-slate-100"} bg-sky-800 px-6 py-2 m-3 rounded`}
            >
              Próxima Pergunta
            </button>
          </div>
        </div>

        {/* answer  section*/}
         {/* <div className="md:w-[30%] w-full p-4 bg-slate-200">
          {showResult && (
            <div>
              <h3 className="text-2xl font-medium">Your Score: </h3>
              <div className="h-[220px] w-[220px] mx-auto mt-8 flex flex-col justify-center items-center border-2 rounded-tr-[50%] rounded-bl-[50%]">
                <h3
                  className={`text-xl ${
                    status === "Passed" ? "text-green-800" : "text-red-500"
                  }`}
                >
                  {status}
                </h3>
                <h1 className="text-3xl font-bold my-2">
                  {score}
                  <span className="text-slate-800">/30</span>
                </h1>
                <p className="text-sm flex justify-center items-center gap-2">
                  Total Time:{" "}
                  <span className="text-xl text-orange-500">
                    {formatTime(TIMEFORTEST - timer)}
                    <span className="text-xs">sec</span>
                  </span>
                </p>
              </div>
              <button
                onClick={restartQuiz}
                className="bg-[#FCC822] text-white w-full py-2 rounded mt-16"
              >
                Restart
              </button>
            </div>
          )}
          {loading && <Loading />}
        </div> */}
      </div>
    </main>
  );
};

export default Quiz;
