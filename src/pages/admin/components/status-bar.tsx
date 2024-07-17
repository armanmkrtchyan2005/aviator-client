import { useRef } from "react";
import { useAppDispatch, filterByStatus, StatusFiltersValues } from "@/store";

const filters = [
    { value: "", label: "Все" },
    { value: "Ожидает оплаты", label: "Активные" },
    { value: "Успешно завершена", label: "Успешно завершённые" },
    { value: "Отменена", label: "Отменённые" }
] as const;

export const StatusBar = () => {
    const previousSelectedFilterIndex = useRef(0);
    const dispatch = useAppDispatch();

    const onClickHandler: React.MouseEventHandler<HTMLUListElement> = event => {
        const options = event.currentTarget;
        options.children[previousSelectedFilterIndex.current].setAttribute(
            "aria-selected",
            "false"
        );

        const selectedOption = event.target as HTMLLIElement;

        if (!selectedOption.matches("li")) return;

        const indexOfSelectedOption = Array.prototype.indexOf.call(
            options.children,
            selectedOption
        );

        options.children[indexOfSelectedOption].setAttribute(
            "aria-selected",
            "true"
        );
        previousSelectedFilterIndex.current = indexOfSelectedOption;

        const filterValue = selectedOption.getAttribute("aria-label");

        if (!filterValue) return;

        dispatch(filterByStatus(filterValue as StatusFiltersValues));
    };

    return (
        <aside className="col-start-2 col-end-3 row-start-1 row-end-3 w-52">
            <section className="rounded-md bg-white p-2 text-left">
                <h2 className="text-center text-lg font-bold">Статусы</h2>
                <ul
                    tabIndex={0}
                    onClick={onClickHandler}
                >
                    {filters.map((filter, i) => (
                        <li
                            key={filter.label}
                            aria-selected={i === 0}
                            aria-label={filter.value}
                            // onClick={() =>
                            //     dispatch(filterByStatus(filter.value))
                            // }
                            className="cursor-pointer aria-[selected=true]:font-semibold aria-[selected=true]:text-blue-500"
                        >
                            {filter.label}
                        </li>
                    ))}
                </ul>
            </section>
        </aside>
    );
};
