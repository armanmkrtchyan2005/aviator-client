// import { useState, useMemo, useCallback } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    // getPaginationRowModel,
    useReactTable,
    flexRender,
    getPaginationRowModel
} from "@tanstack/react-table";
import {
    useStateSelector,
    // useAppDispatch,
    useGetAllReplenishmentsListForAdminQuery,
    selectAllFilters,
    Replenishment
} from "@/store";

import { StatusBar } from "./components/status-bar";
import { TableRowsPerPageSelector } from "./components/table-rows-per-page-selector";
import { Paginator } from "./components/paginator";
import { PageNavigation } from "./components/page-navigation";

import { formatDate, formatTime, formatCurrency } from "@/utils/helpers";

import { IoSearchSharp } from "react-icons/io5";

const columns = [
    {
        id: "id",
        header: "ID заявки",
        accessorKey: "_id"
    },
    {
        id: "amount",
        header: "Сумма",
        accessorFn: (row: Replenishment) =>
            `${formatCurrency(row.amount)} ${row.currency}`
    },
    {
        id: "debit",
        header: "Сумма списания",
        accessorFn: (row: Replenishment) =>
            `${formatCurrency(row.deduction)} ${row.currency}`
    },
    {
        id: "status",
        header: "Статус",
        accessorKey: "status"
    },
    {
        id: "requisite",
        header: "Реквизиты",
        accessorFn: (row: Replenishment) =>
            `*${row?.requisite?.requisite?.slice(-4)}`
    },
    {
        id: "date",
        header: "Дата",
        cell: cell => {
            return (
                <>
                    <time
                        dateTime={cell.row.original?.createdAt}
                    >{`Создано: ${formatDate(
                        cell.row.original.createdAt
                    )} ${formatTime(
                        cell.row.original.createdAt,
                        "%H:%M:%S"
                    )}`}</time>
                    {cell.row.original?.completedDate ? (
                        <time
                            dateTime={cell.row.original?.completedDate}
                        >{`Завершено: ${formatDate(
                            cell.row.original?.completedDate
                        )} ${formatTime(
                            cell.row.original?.createdAt,
                            "%H:%M:%S"
                        )}`}</time>
                    ) : null}
                </>
            );
        }
    },
    {
        id: "actions",
        header: "Действия",
        cell: cell => {
            console.log(cell.row.original);

            return <button>Нажми меня</button>;
        }
    }
];

export const AdminReplenishmentPage = () => {
    const { data: replenishments, isSuccess } =
        useGetAllReplenishmentsListForAdminQuery();

    console.log("Data: ", replenishments);

    return (
        <article className="rounded-xl bg-slate-200 px-2 py-6 text-black">
            <header className="flex items-center justify-between leading-none">
                <h1 className="text-2xl leading-none">
                    Выберите заявку на пополнение
                </h1>
                <span>
                    Добро пожаловать, User123
                    <a className="ml-3 cursor-pointer text-blue-500">Выйти</a>
                </span>
            </header>
            <section className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] gap-x-3">
                <header className="rounded-lg bg-white px-3 py-2">
                    <Search />
                </header>
                {isSuccess ? (
                    <ReplenishmentsTable
                        data={replenishments}
                        columns={columns}
                    />
                ) : null}
                <StatusBar />
            </section>
        </article>
    );
};

interface TableProps {
    data: Replenishment[];
    columns: typeof columns;
}

const ReplenishmentsTable: React.FC<TableProps> = ({ data, columns }) => {
    const filters = useStateSelector(state => selectAllFilters(state));
    // const dispatch = useAppDispatch();

    // const onColumnFiltersChange = useCallback([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters: filters
        },
        enableFilters: true,
        enableColumnFilters: true
        // onColumnFiltersChange: params =>
        //     dispatch(filterByStatus( params ))
    });

    return (
        <>
            <table className="table-fixed overflow-hidden rounded-lg">
                <thead className="min-w-full border-b-4 border-double border-b-gray-400 bg-gray-300 text-xl font-medium uppercase text-gray-700">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            // className="min-w-full text-base [&>*:nth-child(1)]:w-[72px] [&>*:nth-child(2)]:w-fit [&>*:nth-child(3)]:w-2/12 [&>*:nth-child(4)]:w-[250px] [&>*:nth-child(5)]:w-[150px] [&>*:nth-child(6)]:w-max [&>*:nth-child(7)]:w-[150px] [&>*:nth-child(8)]:w-max [&>*:nth-child(9)]:w-max"
                            className="text-base"
                        >
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    // onClick={header.column.getToggleSortingHandler()}
                                    className="px-3 py-2"
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="[&>*:nth-child(even)]:bg-white [&>*:nth-child(odd)]:bg-gray-100">
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            className="border-b border-b-gray-400 text-xs leading-none"
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className="px-3 py-2 "
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="col-span-2 flex w-full items-center justify-between py-5">
                <TableRowsPerPageSelector
                    onChange={event => {
                        table.setPageSize(Number(event.value));
                    }}
                />

                <Paginator
                    hasPreviousPage={!table.getCanPreviousPage()}
                    hasNextPage={!table.getCanNextPage()}
                    goToTheFirstPage={() => table.setPageIndex(0)}
                    goToThePreviousPage={() => table.previousPage()}
                    goToTheNextPage={() => table.nextPage()}
                    goToTheLastPage={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                    }
                />

                <PageNavigation
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={table.getPageCount()}
                    goToPage={table.setPageIndex}
                />
            </div>
        </>
    );
};

const Search = () => {
    return (
        <div className="flex h-10 w-5/12 ">
            <div className="group flex h-full basis-full items-center overflow-hidden rounded-l-full border-2 border-slate-300 has-[input:focus]:border-blue-300">
                <div className="hidden pl-4 group-has-[input:focus]:block">
                    <IoSearchSharp className="text-xl" />
                </div>
                <input
                    type="text"
                    placeholder="Введите запрос"
                    className="h-full flex-auto pl-4 focus-visible:outline-transparent"
                />
            </div>
            <button className="flex w-16 items-center justify-center rounded-none rounded-r-full border-2 border-l-0 border-slate-300 bg-slate-200">
                <IoSearchSharp className="text-xl" />
                <span className="sr-only">Поиск</span>
            </button>
        </div>
    );
};
