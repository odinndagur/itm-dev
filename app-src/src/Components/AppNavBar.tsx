import {
    Link,
    useMatch,
    useMatchRoute,
    useRouter,
} from '@tanstack/react-location'
import { Menu, Transition } from '@headlessui/react'
import './AppNavBar.css'

function NavItem({
    route,
    icon,
    name,
    type,
    style,
    className,
}: {
    route: string
    icon: string
    name: string
    type: 'footer' | 'header'
    style?: any
    className?: string
}) {
    return (
        <Link
            className={className + ' nav-item nav-item-' + type}
            to={route}
            getActiveProps={() => ({
                style: { fontWeight: 'bold' },
            })}
            search={(old) => ({ ...old, scroll: 0 })}
        >
            <div className="material-symbols-outlined">{icon}</div>
            <div className="nav-text">{name}</div>
        </Link>
    )
}

export function AppNavBar({ type }: { type: 'footer' | 'header' }) {
    const navItems = [
        { route: '/home', icon: 'home', name: 'Heim', type: type },
        {
            route: '/collection',
            icon: 'sign_language',
            name: 'Öll tákn',
            type: type,
        },
        { route: '/leit', icon: 'search', name: 'Leit', type: type },
        {
            route: '/settings',
            icon: 'account_box',
            name: 'Stillingar',
            type: type,
        },
        {
            route: '/random',
            icon: 'shuffle',
            name: 'Tákn af handahófi',
            type: type,
        },
    ]

    const currentPathName = useMatch().pathname
    const basePath = useRouter().basepath
    let currentRouteName = 'Fara'
    for (let route of navItems) {
        console.log(basePath, currentPathName)
        if (
            currentPathName.replace(basePath!, '').replaceAll('/', '') ==
            route.route.replaceAll('/', '')
        ) {
            currentRouteName = route.name
            console.log(route)
        } else {
            currentRouteName = currentPathName
                .replace(basePath!, '')
                .replaceAll('/', '')
        }
    }
    return (
        <div className="nav-container">
            {type == 'header' && (
                <Menu
                    as={'div'}
                    className="relative inline-block text-left small-menu"
                >
                    <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        {currentRouteName}
                    </Menu.Button>
                    <Menu.Items className="absolute mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {navItems.map((item) => {
                            return (
                                <Menu.Item as="div" key={item.name}>
                                    {({ active }) => (
                                        <NavItem
                                            {...item}
                                            className={`${
                                                active
                                                    ? 'bg-violet-500 text-white'
                                                    : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        />
                                    )}
                                </Menu.Item>
                            )
                        })}
                    </Menu.Items>
                </Menu>
            )}
            <nav
                className={type === 'footer' ? 'app-navbar' : 'desktop-navbar'}
            >
                {navItems.map((item) => {
                    return <NavItem {...item} key={item.name} />
                })}
            </nav>
        </div>
    )
}
