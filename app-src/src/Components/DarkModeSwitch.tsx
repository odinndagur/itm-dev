//@ts-nocheck
export function DarkModeSwitch() {
    // set the selector switch to the right setting
    // var modeToggle = document.getElementById('light-dark-toggle')
    // if (window.dark) {
    //     modeToggle.checked = true
    // } else {
    //     modeToggle.checked = false
    // }

    // modeToggle.addEventListener('change', function () {
    //     window.dark = modeToggle.checked
    //     if (window.dark) {
    //         document.documentElement.classList.add('dark-mode')
    //     } else {
    //         document.documentElement.classList.remove('dark-mode')
    //     }
    //     localStorage.setItem('theme_mode', JSON.stringify(window.dark))
    //     lazyLoad()
    // })

    const toggleDarkMode = () => {
        console.log('darkmode')
        window.dark = JSON.parse(window.localStorage.getItem('theme_mode'))
        // if (window.dark === null) {}
        if (window.dark) {
            document.documentElement.classList.add('dark-mode')
        } else {
            document.documentElement.classList.remove('dark-mode')
        }
        localStorage.setItem('theme_mode', JSON.stringify(!window.dark))
    }
    return (
        <button className="flex pad center" onClick={() => toggleDarkMode()}>
            Toggle dark mode
        </button>
    )
}
