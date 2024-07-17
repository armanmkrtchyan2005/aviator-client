import { cn } from "@/utils";

type TableProps<
    H extends string[] | number[] | object,
    D extends (string[] | number[] | object)[]
> = {
    headers: H;
    data: D;
    renderCaption?: React.ReactNode;
    renderHeader?: (headers: H) => React.ReactElement;
    renderData: (data: D) => React.ReactElement;
};

export const Table = <
    H extends (string | number)[],
    D extends (string[] | number[] | object)[]
>({
    renderCaption: caption,
    headers,
    data,
    renderHeader = headers => (
        <Row>
            {headers.map(header => (
                <TableHeaderCell key={header}>{header}</TableHeaderCell>
            ))}
        </Row>
    ),
    renderData,
    className,
    ...props
}: TableProps<H, D> & React.TableHTMLAttributes<HTMLTableElement>) => {
    return (
        <table
            {...props}
            className={cn(
                "w-full border-separate border-spacing-x-0 border-spacing-y-1 leading-none",
                className
            )}
        >
            {caption ? caption : null}
            <thead>{renderHeader(headers)}</thead>
            <tbody className="text-sm">{renderData?.(data)}</tbody>
        </table>
    );
};

interface CaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export const Caption: React.FC<CaptionProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <caption
            {...props}
            className={cn("px-1 py-2 text-sm text-[#9ea0a3]", className)}
        >
            {children}
        </caption>
    );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const Row: React.FC<RowProps> = ({ className, children, ...props }) => {
    return (
        <tr
            {...props}
            className={cn(
                "[&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg ",
                className
            )}
        >
            {children}
        </tr>
    );
};

interface TableHeaderCellProps
    extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <th
            {...props}
            className={cn("p-1 text-xs text-[#7b7b7b]", className)}
        >
            {children}
        </th>
    );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const Cell: React.FC<TableCellProps> = ({
    className,
    children,
    ...props
}) => {
    return (
        <td
            {...props}
            className={cn("bg-[#101112] px-1 py-1 text-[#bbbfc5]", className)}
        >
            {children}
        </td>
    );
};
