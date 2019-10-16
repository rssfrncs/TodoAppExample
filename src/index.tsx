import * as React from "react";
import { render } from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { DndProvider } from "react-dnd";
import html5 from "react-dnd-html5-backend";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { priorities, Priority, getTodosByPriorityType } from "./reducer";
import { TodoContainer, TodoList } from "./Todo";
import { Create, Clear } from "./Management";

export const styledConstants = {
  space: 10,
  tint: "rgba(0,0,0,0.2)",
  hover: "#ff9933"
};

export const priorityDisplayStrings: { [key in Priority]: string } = {
  important: "Important",
  lifeChanging: "Life Changing",
  meh: "Meh"
};

const App = () => (
  <Provider store={store}>
    <DndProvider backend={html5}>
      <PersistGate loading={null} persistor={persistor}>
        <div style={{ display: "flex" }}>
          {priorities.map(priority => (
            <TodoContainer priority={priority}>
              <h2 style={{ marginBottom: styledConstants.space }}>
                {priorityDisplayStrings[priority]}
              </h2>
              <TodoList priority={priority} />
            </TodoContainer>
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

render(<App />, document.getElementById("app"));
