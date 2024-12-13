import Joinspace from './Joinspace'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Space from './Space'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Joinspace />
  },
  {
    path: "/space/:spaceId",
    element: <Space />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
