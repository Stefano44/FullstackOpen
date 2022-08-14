const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('when there is initially some blogs saved', () => {
  test('Blogs are all returned as json', async() => {

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('Blog has defined id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('when creating a new blog', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const user = ({
      username: 'testUser',
      name: 'Test User',
      password: 'salainen'
    })

    await api
      .post('/api/users')
      .send(user)
  })

  test('a valid blog can be added', async () => {

    const login = ({
      username: 'testUser',
      password: 'salainen'
    })

    const loggedUser = await api
      .post('/api/login')
      .send(login)

    const newBlog = {
      title: 'Test blog',
      author: 'Testaaja',
      url: 'www.testiblogi.fi',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).toContain(
      'Test blog'
    )
  })

  test('adding fails with status code 401 if token is not included', async () => {
    const login = ({
      username: 'testUser',
      password: 'salainen'
    })

    await api
      .post('/api/login')
      .send(login)

    const newBlog = {
      title: 'Test blog',
      author: 'Testaaja',
      url: 'www.testiblogi.fi',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if likes are null, it will turn to 0', async () => {

    const login = ({
      username: 'testUser',
      password: 'salainen'
    })

    const loggedUser = await api
      .post('/api/login')
      .send(login)

    const newBlog = {
      title: 'Test blog',
      author: 'Testaaja',
      url: 'www.testiblogi.fi',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    blogsAtEnd.find(blog => {
      if(blog.title === newBlog.title) {
        expect(blog.likes).toEqual(0)
      }
    })
  })

  test('if title or url is missing get status code 400', async () => {

    const login = ({
      username: 'testUser',
      password: 'salainen'
    })

    const loggedUser = await api
      .post('/api/login')
      .send(login)

    const newBlog = {
      author: 'Testaaja',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(400)
      .expect('Bad request')
  })
})



test('likes can be updated', async () => {
  const login = ({
    username: 'testUser',
    password: 'salainen'
  })

  const loggedUser = await api
    .post('/api/login')
    .send(login)

  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }


  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .set('Authorization', `bearer ${loggedUser.body.token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length
  )

  const updatedBlogInDb = blogsAtEnd.find(blog => blog.title === blogToUpdate.title)
  expect(updatedBlogInDb.likes).toBe(8)

})

describe('deletion of a blog', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const user = ({
      username: 'testUser',
      name: 'Test User',
      password: 'salainen'
    })

    await api
      .post('/api/users')
      .send(user)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const login = ({
      username: 'testUser',
      password: 'salainen'
    })

    const loggedUser = await api
      .post('/api/login')
      .send(login)

    const newBlog = {
      title: 'Delete This Blog',
      authror: 'Delete Man',
      url: 'www.deleted.fi',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(blog => blog.title === newBlog.title)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })

  test('fails with status code 404 if id is invalid', async () => {
    const login = ({
      username: 'testUser',
      password: 'salainen'
    })

    const loggedUser = await api
      .post('/api/login')
      .send(login)

    const validNonexistsingId = await helper.nonExistingId()

    console.log(validNonexistsingId)

    await api
      .delete(`/api/blogs/${validNonexistsingId}`)
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(404)
  })
})



afterAll(() => {
  mongoose.connection.close()
})