import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (addedBlog) => {
    console.log('adding blog', addedBlog.title, addedBlog.author, addedBlog.url)

    blogService
      .create(addedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(
          `a new blog ${addedBlog.title} by ${addedBlog.author} added`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
  }

  const handleRemove = async (removedBlog) => {
    console.log('clicked')
    if (window.confirm(`Remove blog ${removedBlog.title} by ${removedBlog.author}`)) {
      await blogService
        .remove(removedBlog.id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== removedBlog))
        })
    }
  }

  const handleLikes =  async (likedBlog) => {
    const updatedBlog = { ...likedBlog, likes: likedBlog.likes + 1 }
    blogService
      .update(likedBlog.id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== likedBlog.id ? blog : returnedBlog ))
      })
  }

  blogs.sort((a, b) => b.likes - a.likes)


  if (user === null) {
    return (
      <div>
        <h1>log in to application</h1>
        <Notification message={notificationMessage}/>
        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value) }
            />
          </div>
          <div>
          password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value) }
            />
          </div>
          <button id='login-button' type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notificationMessage}/>

      <p>
        {user.name} logged in
        <button onClick={() =>
          window.localStorage.removeItem('loggedBloglistUser')}>logout
        </button>
      </p>
      <Togglable buttonLabel="new note">
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLikes={handleLikes}
          user={user}
          handleRemove={handleRemove}
        />
      )}
    </div>
  )
}

export default App

