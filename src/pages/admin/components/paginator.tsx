import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight
} from "react-icons/md";

interface PaginatorProps {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    goToTheNextPage: () => void;
    goToThePreviousPage: () => void;
    goToTheFirstPage: () => void;
    goToTheLastPage: () => void;
}

export const Paginator: React.FC<PaginatorProps> = ({
    hasNextPage,
    hasPreviousPage,
    goToTheNextPage,
    goToThePreviousPage,
    goToTheFirstPage,
    goToTheLastPage
}) => {
    return (
        <div className="text-xl">
            <button
                title="Первая страница"
                disabled={hasPreviousPage}
                onClick={goToTheFirstPage}
                className="mh:hover:bg-neutral-100 aspect-square w-12 rounded-full bg-white active:bg-neutral-300 disabled:pointer-events-none disabled:text-neutral-400"
            >
                <MdKeyboardDoubleArrowLeft className="m-auto block" />
            </button>
            <button
                title="Предыдущая страница"
                disabled={hasPreviousPage}
                onClick={goToThePreviousPage}
                className="mh:hover:bg-neutral-100 aspect-square w-12 rounded-full bg-white active:bg-neutral-300 disabled:pointer-events-none disabled:text-neutral-400"
            >
                <MdKeyboardArrowLeft className="m-auto block" />
            </button>
            <button
                title="Следующая страница"
                disabled={hasNextPage}
                onClick={goToTheNextPage}
                className="mh:hover:bg-neutral-100 aspect-square w-12 rounded-full bg-white active:bg-neutral-300 disabled:pointer-events-none disabled:text-neutral-400"
            >
                <MdKeyboardArrowRight className="m-auto block" />
            </button>
            <button
                title="Последняя страница"
                disabled={hasNextPage}
                onClick={goToTheLastPage}
                className="mh:hover:bg-neutral-100 aspect-square w-12 rounded-full bg-white active:bg-neutral-300 disabled:pointer-events-none disabled:text-neutral-400"
            >
                <MdKeyboardDoubleArrowRight className="m-auto block" />
            </button>
        </div>
    );
};
