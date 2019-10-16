import * as React from "react";
import { render } from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import html5 from "react-dnd-html5-backend";
import { persistor, store, useTypedSelector, useTypedDispatch } from "./store";
import { Provider } from "react-redux";
import produce from "immer";
// @ts-ignore
import shortid from "shortid";
import { priorities, Priority, getTodosByPriorityType } from "./reducer";

const styledConstants = {
  space: 10,
  tint: "rgba(0,0,0,0.2)",
  hover: "#ff9933"
};

const priorityDisplayStrings: { [key in Priority]: string } = {
  important: "Important",
  lifeChanging: "Life Changing",
  meh: "Meh"
};

const TodoDrop: React.FC<{ priority: Priority }> = ({ priority, children }) => {
  const d = useTypedDispatch();
  const [{ isOver }, drop] = useDrop({
    accept: "todo",
    drop: (item: any) => {
      d({
        type: "todo edited",
        payload: {
          id: item.id,
          priority
        }
      });
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  });
  return (
    <div
      style={{
        flex: 1,
        margin: styledConstants.space,
        padding: styledConstants.space,
        border: isOver
          ? `2px solid ${styledConstants.hover}`
          : "2px solid transparent"
      }}
      ref={drop}
    >
      {children}
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <DndProvider backend={html5}>
      <PersistGate loading={null} persistor={persistor}>
        <div style={{ display: "flex" }}>
          {priorities.map(priority => (
            <TodoDrop key={priority} priority={priority}>
              <h2 style={{ marginBottom: styledConstants.space }}>
                {priorityDisplayStrings[priority]}
              </h2>
              <Todos priority={priority} />
            </TodoDrop>
          ))}
        </div>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            padding: styledConstants.space,
            background: styledConstants.tint,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Create />
          <Clear />
        </div>
      </PersistGate>
    </DndProvider>
  </Provider>
);

const Todos: React.FC<{ priority: Priority }> = ({ priority }) => {
  const todos = useTypedSelector(state =>
    getTodosByPriorityType(state.todos, priority)
  );
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {todos.map(todoID => (
        <Todo key={todoID} id={todoID} />
      ))}
    </div>
  );
};

const Todo: React.FC<{ id: string }> = ({ id }) => {
  const d = useTypedDispatch();
  const todo = useTypedSelector(state => state.todos[id]);
  const [_, drag] = useDrag({
    item: {
      type: "todo",
      id
    }
  });
  return todo ? (
    <div
      aria-label="todo"
      ref={drag}
      className="todo"
      style={{
        border: "2px solid black",
        padding: styledConstants.space,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: styledConstants.space
      }}
    >
      <span>{todo.message}</span>
      <button
        aria-label="delete todo"
        className="icon-button"
        onClick={() => d({ type: "todo remove button clicked", payload: id })}
        style={{ background: "none", fontSize: "1.5rem" }}
      >
        <i aria-role="icon">🗑️</i>
      </button>
    </div>
  ) : null;
};

const Clear = () => {
  const d = useTypedDispatch();
  const disabled = useTypedSelector(
    state => Object.keys(state.todos).length === 0
  );
  return (
    <button
      aria-label="clear"
      disabled={disabled}
      onClick={() => d({ type: "clear button clicked" })}
      style={{
        background: "#e80033",
        padding: `${styledConstants.space}px ${styledConstants.space * 3}px`,
        color: "white"
      }}
    >
      Clear all
    </button>
  );
};

type CreateState = {
  message: string;
  priority: Priority;
};
type CreateAction =
  | {
      type: "clear";
    }
  | {
      type: "update message";
      payload: string;
    }
  | {
      type: "update priority";
      payload: Priority;
    };

const Create = () => {
  const d = useTypedDispatch();
  const [state, dispatch] = React.useReducer<
    React.Reducer<CreateState, CreateAction>
  >(
    (state, action) => {
      return produce(state, draft => {
        switch (action.type) {
          case "clear": {
            return {
              priority: "meh",
              message: ""
            };
          }
          case "update message": {
            draft.message = action.payload;
            break;
          }
          case "update priority": {
            draft.priority = action.payload;
            break;
          }
        }
      });
    },
    { message: "", priority: "meh" }
  );
  return (
    <form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: styledConstants.space
        }}
      >
        <span style={{ marginBottom: styledConstants.space }}>Message</span>
        <input
          required
          aria-label="new todo message"
          value={state.message}
          onChange={e =>
            dispatch({
              type: "update message",
              payload: e.target.value
            })
          }
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: styledConstants.space
        }}
      >
        <span style={{ marginBottom: styledConstants.space }}>Priority</span>
        <fieldset style={{ border: "none", padding: 0 }}>
          {priorities.map(priority => (
            <>
              <input
                id={priority}
                aria-label="new todo priority"
                type="radio"
                checked={state.priority === priority}
                onChange={() =>
                  dispatch({
                    type: "update priority",
                    payload: priority
                  })
                }
              />
              <label key={priority} htmlFor={priority}>
                {priorityDisplayStrings[priority]}
              </label>
            </>
          ))}
        </fieldset>
      </div>
      <button
        onClick={e => {
          e.preventDefault();
          if (!state.message) return;
          d({
            type: "todo created",
            payload: {
              message: state.message,
              priority: state.priority,
              id: shortid.generate()
            }
          });
          dispatch({
            type: "clear"
          });
        }}
        style={{
          background: "green",
          padding: `${styledConstants.space}px ${styledConstants.space * 3}px`,
          color: "white"
        }}
      >
        Add
      </button>
    </form>
  );
};

render(<App />, document.getElementById("app"));
