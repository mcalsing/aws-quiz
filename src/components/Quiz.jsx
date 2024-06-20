import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TIMEFORTEST = 2*60;
const AMOUNTQUESTIONS = 5; 

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
  const [isButtonNextDisabled, setIsButtonNextDisabled] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState({})

  useEffect(() => {
    fetch("/quiz.json")
      .then((response) => response.json())
      .then((data) => {
         data.sort(() => Math.random() - 0.5);
        setQuestions(data);
      })
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  useEffect(() => {
    const questionAnswerMap = {};
    for (const question of questions) {
      questionAnswerMap[question.id] = question.answer;
    }
    setCorrectAnswers(questionAnswerMap);
  }, [questions]);

  useEffect(() => {
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

  const handleAnswerSelect = (questionId, selectedOption) => {
    // Handle answer selection logic here
    const updatedAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < AMOUNTQUESTIONS) {
      /* setIsButtonDisabled(currentQuestionIndex === questions.length - 2); */
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } 
    if ((currentQuestionIndex === (AMOUNTQUESTIONS - 2) )) {
      setIsButtonNextDisabled(true);
      if (timer === 0 ) {
        setShowResult(true);
      }
    } 
  }

  const handleSubmit = () => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    clearInterval(timerIntervalId);

    // Calculate score and show result
    setTimeout(() => {
      const quizScore = calculateScore(answers);
      setScore(quizScore);
      const percentage = (quizScore / AMOUNTQUESTIONS) * 100;
      // Determine the status based on the percentage
      const newStatus = percentage >= 70 ? "Passed" : "Failed";
      setStatus(newStatus);
      setShowResult(true);
      setLoading(false);
      setShowQuestion(false)
    }, 1000);
  };

  const calculateScore = (userAnswers) => {
    
    const questionAnswerMap = {};
    for (const question of questions) {
      questionAnswerMap[question.id] = question.answer;
    }
    let score = 0;
    for (const questionId in userAnswers) {
      const correctAnswer = correctAnswers[questionId];
      if (userAnswers[questionId] === correctAnswer) {
        score++;
      }
    }
    return score;
  };

  // Reset states and reload the page
  const restartQuiz = () => {
    window.location.reload();
  };

  return (
    <main>
      {showQuestion && (
        <div className="flex justify-center gap-1 pt-3">
          <p className="text-x1 text-slate-700">Tempo restante:</p>
          <h1 className="text-green-700" id="count">
            {formatTime(timer)}
          </h1>
        </div>
      )}
      <div className="w-[800px] mx-auto">
        {/* question section */}
        {showQuestion && (
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
                        className={`border border-gray-400 rounded p-5 cursor-pointer hover:bg-sky-800 hover:text-slate-400 
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
                onClick={handleNextQuestion}
                disabled={isButtonNextDisabled}
                className={`${isButtonNextDisabled ? "text-slate-400" : "text-slate-100"} bg-sky-800 px-6 py-2 m-3 rounded`}
              >
                Próxima Pergunta
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isButtonNextDisabled}
                className={`${!isButtonNextDisabled ? "text-slate-400" : "text-slate-100"} text-slate-100 bg-sky-800 px-16 py-2 m-3 rounded`}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        {/* answer  section*/}
        {showResult && (
          <div className="text-slate-700">
            <h3 className="text-2xl font-medium mt-3">Sua pontuação: </h3>
            <div className="h-[240px] w-[240px] mx-auto mt-4 flex flex-col justify-center items-center border-2 border-sky-800 rounded-tr-[50%] rounded-bl-[50%]">
              <h3
                className={`text-xl ${
                  status === "Passed" ? "text-green-800" : "text-red-500"
                }`}
              >
                {status}
              </h3>
              <h1 className="text-4xl my-2">
                {((score/AMOUNTQUESTIONS)*100).toFixed(1)}%
                {/* <span className="text-slate-700">/60</span> */}
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
              className="bg-sky-800 text-slate-100 w-full py-2 rounded mt-10"
            >
              Restart
            </button>
            <p className="text-xl mt-5">Respostas Incorretas - {AMOUNTQUESTIONS - score}/{AMOUNTQUESTIONS}:</p>
            <ul>
              {Object.keys(answers).map((key) => {
                const correctAnswer = correctAnswers[key];
                const question = questions.find((q) => q.id === parseInt(key));
                const questionDescription = question?.description;
                if (answers[key] !== correctAnswer) {
                  return (
                    <li key={key} className="text-base text-justify mt-6">
                      <p className="font-bold mb-1">Questão {key}: {question.question}</p>
                      <ul className="list-disc pl-8">
                        {question.options.map((option, index) => (
                          <li key={index}>
                            <p
                              className={`${answers[key] === option ? "text-red-500" : ""}`}
                            >
                              {option}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2"><b>Resposta Correta: </b>{correctAnswer}</p>
                      <p className="mt-2"><b>Explicação: </b>{questionDescription}</p>
                    </li>
                  );
                }
                return null; // Não renderizar se a resposta estiver correta
              })}
            </ul>
          </div>
        )}
        {loading && <Loading />}
      </div> 
    </main>
  );
};

export default Quiz;
