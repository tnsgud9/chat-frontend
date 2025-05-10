import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          Root Layout
          <Outlet />
        </div>
      ),
      children: [
        {
          path: "auth",
          element: (
            <div>
              Auth Layout
              <Outlet />
            </div>
          ),
          children: [
            {
              path: "login",
              element: <div>Login Page</div>,
            },
            {
              path: "signup",
              element: <div>Signup Page</div>,
            },
          ],
        },
        {
          path: "chat",
          element: (
            <div>
              Chat Layout
              <Outlet />
            </div>
          ),
          children: [
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
