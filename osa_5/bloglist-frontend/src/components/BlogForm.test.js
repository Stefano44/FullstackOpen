import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const { container } = render(<BlogForm
    createBlog={createBlog}
  />)

  const title = container.querySelector('#title-input')
  const author = container.querySelector('#author-input')
  const url = container.querySelector('#url-input')
  const sendButton = screen.getByText('create')

  await user.type(title, 'Testing a blog')
  await user.type(author, 'Tester Author')
  await user.type(url, 'testing.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing a blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Tester Author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing.com')
})