import { createContext } from 'react'
const ThemeContext = createContext(
    window.localStorage.getItem('theme_mode') ?? 'light'
)

export { ThemeContext }
