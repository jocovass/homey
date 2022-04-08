import { Link, NavLink } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="px-5vw py-4 bg-greenAccent flex items-center justify-between">
            <div>Logo</div>
            <nav>
                <ul className="flex">
                    <li className="mr-3">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'bg-red-400' : ''
                            }
                            to="/"
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <Link
                            to="/login"
                            className="p-1 inline-block relative after:absolute after:bottom-0 after:left-1/2  after:-translate-x-1/2 after:h-px-3 after:bg-red-600 after:w-1/2 after:scale-x-0
                            hover:after:scale-x-100 after:transition-transform"
                        >
                            Login
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
