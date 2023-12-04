import { Link } from 'react-router-dom'

function NavBar() {
    const navItems = [
        { link: "/ingredients", title: "Ingredients" },
        { link: "/meals", title: "Meals" },
        { link: "/planer", title: "Planer" },
        { link: "/inventory", title: "Inventory" },
    ];

    return (
        <nav className='flex flex-row w-full'>
            <ul className='flex flex-row items-center justify-center w-full'>
                {
                    navItems.map((item) => (
                        <li className='p-2 m-3 text-lg font-normal rounded-md hover:bg-slate-500 hover:text-white' key={item.title}>
                            <Link to={item.link}>{item.title}</Link>
                        </li>
                    ))
                }


            </ul>
        </nav>
    )
}

export default NavBar