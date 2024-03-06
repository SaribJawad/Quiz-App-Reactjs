import { useAppContext } from "../context/Context";

function StartScreen() {
  const { noOfQuestions, dispatch } = useAppContext();

  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{noOfQuestions} questions to text your React mastery</h3>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
