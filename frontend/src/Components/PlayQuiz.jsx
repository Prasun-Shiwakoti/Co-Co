import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";

const PlayQuiz = () => {
  const [quiz, setQuiz] = useState([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const qn = quiz[currentQuestion];
  const token = localStorage.getItem("token");
  const { id } = useParams();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`http://10.10.11.29:8000/llm/generate_quiz?id=${id}`, {
        headers: { "authorization": `token ${token}` }
      })
      console.log('quiz')
      const response = await res.json();
      console.log(response)
      if (response) {
        setQuiz(response.questions);
        setLoading(false);
      }
      else {
        setError('Error Fetching Quiz')
        setLoading(false);
        setTimeout(() => { setError(''), [3000] })
      }
    } catch (err) {
      setError(err);
      setLoading(false)
      setTimeout(() => { setError(''), [3000] })
    }
  };

  const sendQuizResults = async () => {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  };

  const checkCorrect = (option, ans) => {
    if (option === ans) {
      setCurrentScore((prev) => prev + 1);
      console.log(currentScore);
      console.log("correct");
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <div className="w-[80%]">
      <div>
        <div className="flex-col flex items-center justify-center">
          <div className=" p-4 w-[100%]">
            <div className=" bg-blue-100 flex gap-1 items-center rounded-full w-[90%] h-[10vh]">
              <FaUser className="text-blue-900 text-2xl ml-4" />
              <h1 className="text-blue-900 text-2xl font-bold ml-2">Quizes</h1>
            </div>
          </div>
          <hr className="border-blue-900 w-[95%] " />
        </div>
      </div>
      {qn ? (
        <div className="bg-blue-100 m-8 p-4 rounded-lg">
          <h2 className="font-bold text-2xl text-blue-900 mb-4">
            {qn?.question}
          </h2>
          <hr className="border-blue-900 w-[95%] " />

          <div>
            {qn?.choices.map((option, index) => {
              return (
                <div key={index}>
                  <div
                    onClick={() => checkCorrect(option, qn.answer)}
                    className="mt-8  cursor-pointer"
                  >
                    <p className="border border-slate-400 rounded-full m-2 p-3 hover:shadow-slate-300 hover:shadow-xl bg-gray-100">
                      {option}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[50vh]">
          {sendQuizResults()}
          <h1 className="text-2xl font-bold">Quiz Finished!</h1>
          <h1 className="text-2xl font-bold">{`Your Score : ${currentScore}/${quiz.length}`}</h1>
        </div>
      )}
      {console.log(quiz)}
    </div>
  );
};

export default PlayQuiz;
