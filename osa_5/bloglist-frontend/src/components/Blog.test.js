import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'testblogs.com',
    user: {
      name: 'Test Blogger'
    }
  }
  const user = {
    username: 'tester',
    Name: 'Test Blogger'
  }

  const mockHandleLikes = jest.fn()
  const mockHandleRemove = jest.fn()



  test('renders only title and author, but not url and likes', () => {


    const { container }  = render(<Blog
      blog={blog}
      handleLikes={mockHandleLikes}
      handleRemove={mockHandleRemove}
      user={user}
    />)

    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(
      'Test Blog by Test Author'
    )
    const style = container.querySelector('.togglableContent')
    expect(style).toHaveStyle('display : none')
  })

  test('renders also url and likes, when "view" button is clicked', async () => {
    const { container }  = render(<Blog
      blog={blog}
      handleLikes={mockHandleLikes}
      handleRemove={mockHandleRemove}
      user={user}
    />)

    const mockUser = userEvent.setup()
    const button = screen.getByText('view')
    await mockUser.click(button)

    const style = container.querySelector('.togglableContent')
    expect(style).not.toHaveStyle('display : none')

  })

  test('clicking the like button calls event handler twice', async () => {
    render(<Blog
      blog={blog}
      handleLikes={mockHandleLikes}
      handleRemove={mockHandleRemove}
      user={user}
    />)

    const mockUser = userEvent.setup()
    const viewButton = screen.getByText('view')
    await mockUser.click(viewButton)

    const likeButton = screen.getByText('like')
    await mockUser.click(likeButton)
    await mockUser.click(likeButton)


    expect(mockHandleLikes.mock.calls).toHaveLength(2)

  })
})