import { lazy, Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "@/pages/Home";
const Submissions = lazy(() => import("@/pages/Submissions"));
import Fallback from "./components/custom/fallback";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<RootLayout />}
      >
        <Route
          index
          path="/"
          element={<Home />}
        />
        <Route
          path="/submissions"
          element={
            <Suspense fallback={<Fallback />}>
              <Submissions />
            </Suspense>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
