import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Analyze } from "./components/Analyze";
import { Compare } from "./components/Compare";
import { Insights } from "./components/Insights";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "analyze", Component: Analyze },
      { path: "compare", Component: Compare },
      { path: "insights", Component: Insights },
    ],
  },
]);
