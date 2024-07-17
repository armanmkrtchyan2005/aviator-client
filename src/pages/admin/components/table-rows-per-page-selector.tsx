import { FC } from "react";
import Select from "react-select";

interface SelectorProps {
    onChange: (event: { value: string; label: string }) => void;
}

export const TableRowsPerPageSelector: FC<SelectorProps> = ({ onChange }) => {
    const options = [
        { value: "10", label: "10" },
        { value: "20", label: "20" },
        { value: "30", label: "30" },
        { value: "40", label: "40" },
        { value: "50", label: "50" }
    ];

    return (
        <div className="flex items-center gap-4">
            <span className="text-base font-medium">Строк на странице:</span>
            <Select
                className="w-20"
                defaultValue={options[0]}
                onChange={(event: { value: string; label: string }) =>
                    onChange(event)
                }
                options={options}
            />
        </div>
    );
};
