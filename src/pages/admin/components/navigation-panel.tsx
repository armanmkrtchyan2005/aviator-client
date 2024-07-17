import { NavLink } from "react-router-dom";

const links = [
    { id: 1, title: "Пополнения", uri: "replenishments" },
    { id: 2, title: "Выводы", uri: "withdrawals" },
    { id: 3, title: "Пополнить баланс", uri: "balance" },
    { id: 4, title: "Реквизиты", uri: "requisites" }
];

export const NavigationPanel = () => {
    return (
        <nav>
            <ul className="flex gap-4">
                {links.map(link => (
                    <li
                        key={link.id}
                        className='list-none border-white aria-[current="page"]:border-b-2'
                    >
                        <NavLink
                            to={`/admin/dashboard/${link.uri}`}
                            className="text-xl font-bold"
                        >
                            {link.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
