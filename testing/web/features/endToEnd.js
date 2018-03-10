describe('working with the server', () => {
  it('shows lists coming from the server', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-cy=loading]').should('exist')
    cy.contains('second list')
    cy.contains('first list')
  })
})