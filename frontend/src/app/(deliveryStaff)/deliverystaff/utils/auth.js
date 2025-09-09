// Authentication utility functions for delivery staff

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Check if user is authenticated
export const checkAuthentication = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/myprofile`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    return response.ok
  } catch (error) {
    console.error('Authentication check failed:', error)
    return false
  }
}

// Make authenticated API request
export const authenticatedFetch = async (url, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...defaultOptions,
    ...options
  })
  
  if (!response.ok && response.status === 401) {
    // Redirect to login if unauthorized
    window.location.href = '/login'
    throw new Error('Unauthorized - redirecting to login')
  }
  
  return response
}

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await authenticatedFetch('/myprofile')
    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }
}
