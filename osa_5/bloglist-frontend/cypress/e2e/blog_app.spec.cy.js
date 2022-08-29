
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('user can login', function () {
      cy.get('#username').type('testuser')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })

    it('login fails with wrong password', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in ', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      cy.get('#title-input').type('Blog')
      cy.get('#author-input').type('Bob Blogger')
      cy.get('#url-input').type('www.blog.com')
      cy.get('#create-button').click()

      cy.contains('Blog by Bob Blog')
    })

    describe('after posting a blog', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Test Blog',
          author: 'Bob Blogger',
          url: 'www.blog.fi'
        })
      })

      it('A blog can be liked', function() {
        cy.get('#view-button').click()
        cy.get('#likes').contains(0)
        cy.get('#like-button').click()
        cy.get('#likes').contains(1)
      })

      it('User can delete own blog', function() {
        cy.visit('http://localhost:3000')
        cy.get('#view-button').click()
        cy.get('#remove-button').click()
        cy.visit('http://localhost:3000')
        cy.get('html').should('not.contain', 'Blog by Bob Blog')
      })
    })
  })

  it('blogs are ordered by likes', function() {
    cy.login({ username: 'testuser', password: 'salainen' })
    cy.createBlog({
      title: 'The title with the most likes',
      author: 'Bob Blogger',
      url: 'www.blog.fi'
    })
    cy.createBlog({
      title: 'The title with the third most likes',
      author: 'Bob Blogger',
      url: 'www.blog.fi'
    })
    cy.createBlog({
      title: 'The title with the second most likes',
      author: 'Bob Blogger',
      url: 'www.blog.fi'
    })

    cy.contains('The title with the most likes').as('first')
    cy.contains('with the second most').as('second')
    cy.contains('with the third most').as('third')

    cy.get('@first').find('button').click()
    cy.get('@first').parent().find('#like-button').as('like1')
    cy.get('@like1').click()
    cy.wait(500)
    cy.get('@like1').click()
    cy.wait(500)
    cy.get('@like1').click()
    cy.get('@first').find('button').click()

    cy.get('@second').find('button').click()
    cy.get('@second').parent().find('#like-button').as('like2')
    cy.get('@like2').click()
    cy.wait(500)
    cy.get('@like2').click()
    cy.get('@second').find('button').click()

    cy.get('@third').find('button').click()
    cy.get('@third').parent().find('#like-button').click()
    cy.get('@third').find('button').click()

    cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
    cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
    cy.get('.blog').eq(2).should('contain', 'The title with the third most likes')

  })
})