/* eslint-disable react/prop-types */

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,"0")}`;
};

const QuizHeader = ({ timer }) => {
  return (
    <main className="bg-slate-300 w-[800px] flex justify-end">
      <div className="">
        <h1 className="text-green-700 text-xl" id="count">
          {formatTime(timer)}
          <sub className="text-xs ml-1">sec</sub>
        </h1>
        <p className="text-xs -mt-1 text-gray-700">Time Consumed</p>
      </div>
    </main>
  );
};

export default QuizHeader;
