import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";
import NewButton from "./components/NewButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SEC_PER_QUESTION = 20;

const initialState = {
  questions: [],
  // 'loading' , "error", "ready", "active", "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextBtn":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining == 0 ? "finished" : state.status,
      };

    case "sortHard":
      const sortedByHardDifficulty = state.questions
        .slice()
        .sort((a, b) => b.points - a.points);

      return {
        ...state,
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
        questions: sortedByHardDifficulty,
      };
    case "sortEasy":
      const sortedByEasyDifficulty = state.questions
        .slice()
        .sort((a, b) => a.points - b.points);

      return {
        ...state,
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
        questions: sortedByEasyDifficulty,
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    status,
    questions,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
  } = state;

  // total number of question
  const noOfQuestions = questions.length;
  // total points
  const totalPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

  useEffect(function () {
    async function fetchData() {
      try {
        const resp = await fetch("http://localhost:8000/questions");
        const data = await resp.json();
        dispatch({ type: "dataRecieived", payload: data });
      } catch (error) {
        dispatch({ type: "dataFailed", payload: "Data Failed" });
      }
    }
    fetchData();
  }, []);

  function handleSort(e) {
    if (e.target.value === "hard") {
      dispatch({
        type: "sortHard",
      });
    }
    if (e.target.value === "easy") {
      dispatch({ type: "sortEasy" });
    }
  }

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            questionNo={noOfQuestions}
            dispatch={dispatch}
            totalPoints={totalPoints}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              noOfQuestions={noOfQuestions}
              points={points}
              answer={answer}
              totalPoints={totalPoints}
            />
            <Questions
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NewButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                noOfQuestion={noOfQuestions}
              />
            </Footer>
            <select onClick={handleSort} className="btn btn-ui">
              <option value="none" selected disabled hidden>
                Sort by difficulty
              </option>
              <option value="hard">Hard</option>
              <option value="easy">Easy</option>
            </select>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            totalPoints={totalPoints}
            dispatch={dispatch}
            status={status}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
