interface PageNavigationProps {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
    currentPage,
    totalPages,
    goToPage
}) => {
    return (
        <div className="flex items-center text-base">
            <span className="flex items-center gap-1">
                <span>Страница</span>
                <strong>
                    {currentPage} из {totalPages}
                </strong>
                &nbsp;
            </span>
            <span className="flex items-center gap-1">
                | Перейти на страницу:
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    onChange={event => {
                        const page = event.target.value
                            ? Number(event.target.value) - 1
                            : 0;
                        goToPage(page);
                    }}
                    className="w-16 rounded-md border-2 border-solid border-neutral-300 bg-transparent bg-clip-padding px-2 py-1 text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:border-blue-500 focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none"
                />
            </span>
        </div>
    );
};
