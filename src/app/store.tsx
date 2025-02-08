import { configureStore } from "@reduxjs/toolkit";
import DialogReducer from "../features/DialogSlice";
import ValueReducer from "../features/ValueSlice";
// import ItemReducer from "../features/ItemSlice";
export const store = configureStore({
  reducer: {
    dialog: DialogReducer,
    value: ValueReducer,
    // itemValue: ItemReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
