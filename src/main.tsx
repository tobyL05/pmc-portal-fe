import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/:id",
    element: <Home />
  },
  {
    path: "/onboarding",
    element: <></>
  },
  {
    path:"/dashboard",
    element: <h1>Dashboard goes here</h1>
  },
  {
    path: "/event/:eventId", //passes a params object to element containing :id
    element: <></>
  },
  {
    path: "/profile/:profileId",
    element: <></>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
