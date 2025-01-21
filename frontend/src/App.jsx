import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { EditPostPage, Home, Landing, NotificationPage, ProfilePage, Signin, Signup } from './pages'
import { loader as notificationLoader } from './pages/NotificationPage'
import Error from './pages/Error'
import { ErrorElement } from './components'


const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Signin />,
      errorElement: <Error />
    },
    {
      path: 'signup',
      element: <Signup />,
      errorElement: <Error />
    },
    {
      path: 'home',
      element: <Home />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Landing />,
          errorElement: <ErrorElement />
        },

        {
          path: 'profile/:username',
          element: <ProfilePage />,
          errorElement: <ErrorElement />

        },
        {
          path: 'edit-post/:id',
          element: <EditPostPage />,
          errorElement: <ErrorElement />

        },
        {
          path: 'notifications',
          element: <NotificationPage />,
          loader: notificationLoader,
          errorElement: <ErrorElement />,
        },
       
      ]
    }

  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App