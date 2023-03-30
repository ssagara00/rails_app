import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { AuthTop } from './AuthTop'

jest.mock('react-alert')
jest.mock('react-router-dom')

const renderAuthTop = () => {
  render(<AuthTop />)
}

describe('AuthTop', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('画面表示が適切', () => {
    renderAuthTop()

    const edituserimage = screen.getByAltText('user_edit')
    expect(edituserimage).toBeInTheDocument()
    const deliteimage = screen.getByAltText('deleteaccount')
    expect(deliteimage).toBeInTheDocument()
    const contentsimage = screen.getByAltText('contents')    
    expect(contentsimage).toBeInTheDocument()
  })
})