import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/style/main.scss";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
