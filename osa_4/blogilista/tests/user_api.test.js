const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const initialUser = new User({
    username: 'root',
    name: 'SuperUser',
    password: 'salainen'
  })

  await User.insertMany(initialUser)
})

describe('creation of a user', () => {

  test('succeeds with stastuscode 201 when everything is valid', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
  })

  test('fails with statuscode 400 if PASSWORD lenght is less than 3', async () => {

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 's'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails with statuscode 400 if PASSWORD does not exist', async () => {

    const newUser = {
      username: 'testuser',
      name: 'Test User',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })


  test('fails with statuscode 400 if USERNAME lenght is less than 3', async () => {

    const newUser = {
      username: 't',
      name: 'Test User',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails with statuscode 400 if USERNAME does not exist', async () => {

    const newUser = {
      name: 'Test User',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails with statuscode 400 if USERNAME is not unique', async () => {

    const newUser = {
      username: 'root',
      name: 'Test User',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})



afterAll(() => {
  mongoose.connection.close()
})