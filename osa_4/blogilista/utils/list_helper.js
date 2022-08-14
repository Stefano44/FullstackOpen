const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  },0)
}

const favouriteBlog = (blogs) => {
  const favourite = blogs.reduce((max, current) => {
    if (max.likes > current.likes) {
      return max
    } else {
      return current
    }
  })

  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  }
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = lodash.countBy(blogs, 'author')

  const most = Object.keys(blogsByAuthor).reduce((max, current) => {
    if (blogsByAuthor[max] > blogsByAuthor[current]) {
      return max
    } else {
      return current
    }
  })

  return {
    author: most,
    blogs: blogsByAuthor[most]
  }
}

////KESKEN!!!
const mostLikes = (blogs) => {
  const authors = {}

  blogs.forEach((blog) => {
    if (authors[blog.author]) {[
      authors[blog.author] += blog.likes
    ]} else {
      authors[blog.author] = blog.likes
    }
  })

  const mostLikesByAuthor = Object.key(authorsCount)

  return {
    author: most,
    blogs: blogsByAuthor[most]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
}