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


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
}