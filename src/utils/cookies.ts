import Cookies from 'js-cookie'

export const cookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    expires: 365, // 1 year
    sameSite: 'strict' as const,
    path: '/'
}

export const setCookies = (accessToken: string, refreshToken: string) => {
    // Access token in regular cookie for client access
    Cookies.set('accessToken', accessToken, {
        ...cookieOptions,
        expires: 1/96 // 15 minutes
    })
    
    // Refresh token in HTTP-only cookie (set by server)
    // Don't set refresh token on client side for security
}

export const getAccessToken = () => {
    return Cookies.get('accessToken')
}

export const clearCookies = () => {
    Cookies.remove('accessToken', { path: '/' })
    // Refresh token will be cleared by the server
}
