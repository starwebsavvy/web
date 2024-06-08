import logo from "./logo.svg";
import { useSelector, useDispatch } from "react-redux";
import * as Actions from "./store/actions";
import "./App.css";

function App() {
  const count = useSelector(({ user }) => user.cnt);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Current State: {count}</h1>
        <button onClick={() => dispatch(Actions.userInc())}>
          Increment State
        </button>
        <button onClick={() => dispatch(Actions.userDec())}>
          Decrement State
        </button>
      </header>
    </div>
  );
}

export default App;
