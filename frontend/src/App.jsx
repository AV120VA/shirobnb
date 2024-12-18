import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./component/Navigation/Navigation";
import * as sessionActions from "./store/session";
import Home from "./component/Home/Home";
import SpotDetail from "./component/SpotDetails/SpotDetails";
import CreateSpotForm from "./component/CreateSpotForm/CreateSpotForm";
import UpdateSpotForm from "./component/UpdateSpotForm/UpdateSpotForm";
import ManageSpots from "./component/ManageSpots/ManageSpots";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetail />,
      },
      {
        path: "/create-spot",
        element: <CreateSpotForm />,
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
      {
        path: "/update-spot/:spotId",
        element: <UpdateSpotForm />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
