import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLikes, user, handleRemove }) => {
  const [visible, setVisible] = useState(false)


  const showWhenVisible = { display: visible ? '' : 'none' }

  const buttonText =  visible ? 'hide' : 'view'

  const showRemoveButton = { display: blog.user.name !== user.name ? 'none' : '' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }



  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} by {blog.author}
        <button id="view-button" onClick={toggleVisibility}>{buttonText}</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <p>{blog.url}</p>
        <p id="likes">
          {blog.likes}
          <button id="like-button"
            onClick={() => handleLikes(blog)}>
            like
          </button>
        </p>
        <p>{blog.user.name}</p>
        <button id="remove-button" style={showRemoveButton}
          onClick={() => handleRemove(blog)}>remove</button>
      </div>
    </div>
  )}

export default Blog

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number,
  }),
  handleLikes: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string
  }),
  handleRemove: PropTypes.func.isRequired
}