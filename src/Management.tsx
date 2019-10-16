import * as React from "react";
import { useTypedSelector, useTypedDispatch } from "./store";
import produce from "immer";
// @ts-ignore
import shortid from "shortid";
import { priorities, Priority } from "./reducer";
import { styledConstants, priorityDisplayStrings } from ".";

export const Clear = () => {
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

export const Create = () => {
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
