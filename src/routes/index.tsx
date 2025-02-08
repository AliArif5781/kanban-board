import { createBrowserRouter } from "react-router";
import Layout from "../components/layout/Layout";
import HeroSection from "../components/common/HeroSection";
import ErrorPage from "../components/common/Error";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HeroSection />,
      },
    ],
  },
]);

export default router;
