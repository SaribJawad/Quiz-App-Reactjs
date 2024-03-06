import { useAppContext } from "../context/Context";

function NewButton() {
  const { dispatch, answer, index, noOfQuestions } = useAppContext();

  if (answer === null) return null;

  if (index < noOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextBtn" })}
      >
        Next
      </button>
    );

  if (index === noOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finished" })}
      >
        Finish
      </button>
    );
}

export default NewButton;
