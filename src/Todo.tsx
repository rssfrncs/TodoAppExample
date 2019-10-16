import * as React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useTypedSelector, useTypedDispatch } from "./store";

import { Priority, getTodosByPriorityType } from "./reducer";
import { styledConstants } from ".";

export const TodoContainer: React.FC<{ priority: Priority }> = ({
  priority,
  children
}) => {
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

export const TodoList: React.FC<{ priority: Priority }> = ({ priority }) => {
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

export const Todo: React.FC<{ id: string }> = ({ id }) => {
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
