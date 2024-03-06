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
import { useAppContext } from "./context/Context";

function App() {
  const { status, handleSort } = useAppContext();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Questions />
            <Footer>
              <Timer />
              <NewButton />
            </Footer>
            <select onClick={handleSort} className="btn btn-ui select-btn">
              <option value="none" selected disabled hidden>
                Sort by difficulty
              </option>
              <option value="hard">Hard</option>
              <option value="easy">Easy</option>
            </select>
          </>
        )}
        {status === "finished" && <FinishedScreen />}
      </Main>
    </div>
  );
}

export default App;
