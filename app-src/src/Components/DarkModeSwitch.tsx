import { useNavigate } from '@tanstack/react-location'

//@ts-nocheck
export function DarkModeSwitch() {
    const navigate = useNavigate()

    const toggleDarkMode = () => {
        console.log('darkmode')
        const darkModeEnabled = JSON.parse(
            window.localStorage.getItem('theme_mode') ?? 'light'
        )
        // if (darkModeEnabled === null) {}
        if (darkModeEnabled === 'dark') {
            // document.documentElement.classList.add('dark-mode')
            window.setActiveStyleSheet('light')
            localStorage.setItem('theme_mode', JSON.stringify('light'))
        } else {
            // document.documentElement.classList.remove('dark-mode')
            window.setActiveStyleSheet('dark')
            localStorage.setItem('theme_mode', JSON.stringify('dark'))
        }
        // console.log('just toggled darkmode')
        // setTimeout(() => {
        //     console.log(darkModeEnabled)
        //     navigate({
        //         search: (old) => ({ ...old, dark: !darkModeEnabled }),
        //         replace: true,
        //     })
        // }, 150)
    }
    return (
        <button className="flex pad center" onClick={() => toggleDarkMode()}>
            Toggle dark mode
        </button>
    )
}
