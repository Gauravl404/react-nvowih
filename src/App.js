import React, { useState, useReducer, useContext, useEffect } from "react";
import "./style.css";
function appReducer(state, action) {
  switch (action.type) {
    case "add": {
      return [
        ...state,
        {
          id: Date.now(),
          text: action.text,
          iszcompleted: false
        }
      ];
    }
    case "delete": {
      return state.filter(item => item.id !== action.payload);
    }
    case "completed": {
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            iszcompleted: !item.iszcompleted
          };
        }
        return item;
      });
    }
    case "reset": {
      return action.payload;
    }

    default: {
      return state;
    }
  }
}
const Context = React.createContext();
export default function App() {
  const [state, dispatch] = useReducer(appReducer, []);
  const [work, setWork] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("data");
    dispatch({ type: "reset", payload: JSON.parse(raw) });
  }, []);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(state));
  }, [state]);

  const handleChange = e => {
    e.preventDefault();
    setWork(e.target.value);
  };

  const handleClick = () => {
    dispatch({ type: "add", text: work });
    setWork("");
  };
  return (
    <Context.Provider value={dispatch}>
      <div
        style={{
          display: "flex",
          flexdirection: "column",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <h1>GJ Todo App</h1>
      </div>
      <h3
        style={{
          marginLeft: "2%"
        }}
      >
        {Date(Date.now())}
      </h3>
      <div
        style={{
          display: "flex",
          flexdirection: "row",
          justifyContent: "space-evenly"
        }}
      >
        <input
          type="text"
          onChange={e => handleChange(e)}
          value={work}
          style={{ width: "80%" }}
        />
        <button onClick={handleClick}>Add New Todo</button>
      </div>

      <br />
      <br />
      <TodoList items={state} />
    </Context.Provider>
  );
}

function TodoList({ items }) {
  return items.map(item => <TodoItem key={item.id} {...item} />);
}

function TodoItem({ id, text, iszcompleted }) {
  const dispatch = useContext(Context);
  return (
    <div
      style={{
        display: "flex",
        flexdirection: "row",
        justifyContent: "space-around"
      }}
    >
      <input
        type="checkbox"
        checked={iszcompleted}
        onChange={() => dispatch({ type: "completed", payload: id })}
      />
      <input type="text" defaultValue={text} style={{ width: "60%" }} />
      <button onClick={() => dispatch({ type: "delete", payload: id })}>
        Delete Todo
      </button>
    </div>
  );
}
