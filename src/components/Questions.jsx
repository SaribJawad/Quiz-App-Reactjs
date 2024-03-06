import { useAppContext } from "../context/Context";

function Questions() {
  const { questions, dispatch, answer, index: questionIndex } = useAppContext();

  const hasAnswer = answer !== null;

  return (
    <div>
      <h4>{questions[questionIndex].question}</h4>
      <div className="options">
        {questions[questionIndex].options.map((option, index) => (
          <button
            className={`btn btn-option ${index === answer ? "answer" : ""} ${
              hasAnswer
                ? index === questions[questionIndex].correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            key={option}
            disabled={hasAnswer}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Questions;
