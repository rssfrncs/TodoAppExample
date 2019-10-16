import { Reducer } from "redux";
import produce from "immer";
import { sortBy } from "lodash/fp";

export const priorities = ["lifeChanging", "important", "meh"] as const;
export type Priority = typeof priorities[number];

export type Todo = {
  id: string;
  message: string;
  priority: Priority;
};

export type State = {
  todos: { [id: string]: Todo };
};

export type Action =
  | {
      type: "todo created";
      payload: Todo;
    }
  | {
      type: "todo remove button clicked";
      payload: string;
    }
  | {
      type: "clear button clicked";
    }
  | {
      type: "todo edited";
      payload: {
        id: string;
        message?: string;
        priority?: Priority;
      };
    };

const initialState = (): State => ({
  todos: {}
});

export const reducer: Reducer<State, Action> = (
  state = initialState(),
  action
) => {
  return produce(state, draft => {
    switch (action.type) {
      case "todo created": {
        draft.todos[action.payload.id] = action.payload;
        break;
      }
      case "todo remove button clicked": {
        delete draft.todos[action.payload];
        break;
      }
      case "clear button clicked": {
        draft.todos = {};
        break;
      }
      case "todo edited": {
        const current = draft.todos[action.payload.id];
        current.message = action.payload.message || current.message;
        current.priority = action.payload.priority || current.priority;
      }
    }
  });
};

const priorityRanking: { [key in Priority]: number } = {
  meh: 2,
  important: 1,
  lifeChanging: 0
};

export const getSortedTodos = (todos: { [id: string]: Todo }) => {
  return Object.keys(todos).sort((a, b) => {
    const aTodo = priorityRanking[todos[a].priority];
    const bTodo = priorityRanking[todos[b].priority];
    return aTodo < bTodo ? -1 : 1;
  });
};

export const getTodosByPriorityType = (
  todos: { [id: string]: Todo },
  priority: Priority
) => {
  return Object.keys(todos).filter(todoID => {
    const { priority: todoPriority } = todos[todoID];
    return todoPriority === priority;
  });
};
