import { createStore, Dispatch } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { reducer, State, Action } from "./reducer";
import storage from "redux-persist/lib/storage";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

export const store = createStore(
  persistReducer({ key: "root", storage }, reducer)
);
export const persistor = persistStore(store);

export const useTypedSelector = useSelector as TypedUseSelectorHook<State>;
export const useTypedDispatch = useDispatch as () => Dispatch<Action>;
