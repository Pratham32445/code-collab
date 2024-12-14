import Joinspace from './Joinspace'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Space from './Space'
import Login from './Login'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Joinspace />
  },
  {
    path: "/space/:spaceId",
    element: <Space />
  },
  {
    path : "/login",
    element : <Login/>
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
