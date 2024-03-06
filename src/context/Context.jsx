import { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";

const AppContext = createContext();

const secPerQuestion = 20;

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
        secondsRemaining: state.questions.length * secPerQuestion,
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
        secondsRemaining: state.questions.length * secPerQuestion,
        questions: sortedByHardDifficulty,
      };
    case "sortEasy":
      const sortedByEasyDifficulty = state.questions
        .slice()
        .sort((a, b) => a.points - b.points);

      return {
        ...state,
        secondsRemaining: state.questions.length * secPerQuestion,
        questions: sortedByEasyDifficulty,
      };
    default:
      throw new Error("Action unknown");
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
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
    <AppContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        noOfQuestions,
        totalPoints,
        handleSort,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined)
    throw new Error("Context was used outside the provider");

  return context;
}

export { AppProvider, useAppContext };
