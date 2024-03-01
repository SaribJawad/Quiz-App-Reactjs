function Progress({ points, index, noOfQuestions, totalPoints, answer }) {
  return (
    <header className="progress">
      <progress max={noOfQuestions} value={index + Number(answer !== null)} />

      <p>
        Question <strong>{index + 1}</strong> / {noOfQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {totalPoints}
      </p>
    </header>
  );
}

export default Progress;
