function NewButton({ dispatch, answer, index, noOfQuestion }) {
  if (answer === null) return null;

  if (index < noOfQuestion - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextBtn" })}
      >
        Next
      </button>
    );

  if (index === noOfQuestion - 1)
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
