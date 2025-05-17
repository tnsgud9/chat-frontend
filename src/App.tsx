import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AuthLayout from "./layouts/AuthLayout";
import Chat from "./pages/Chat";
import ChatLayout from "./layouts/ChatLayout";
import { Cookies } from "react-cookie";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <Home />,
          loader: () => {
            const cookies = new Cookies();
            if (!cookies.get("access_token")) throw redirect("/auth/login");
            else throw redirect("chat");
          },
        },
        {
          path: "auth",
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "signup",
              element: <Signup />,
            },
          ],
        },
        {
          path: "chat",
          loader: () => {
            const cookies = new Cookies();
            if (!cookies.get("access_token")) throw redirect("/auth/login");
          },
          element: (
            <ChatLayout>
              <Outlet />
            </ChatLayout>
          ),
          children: [
            { index: true, element: <Chat /> },
            {
              path: "rooms",
              element: <div>Chat Rooms Page</div>,
            },
            {
              path: ":roomId",
              element: <div>Chat Room Page</div>,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
