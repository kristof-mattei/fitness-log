import type React from "react";

interface NumberInputRowProperties {
    best: null | number;
    label: string;
    onValueChange: (value: number) => void;
    unit: string;
    value: number;
}

export const NumberInputRow: React.FC<NumberInputRowProperties> = ({ best, label, onValueChange, unit, value }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const parsed = Number(event.target.value);

        onValueChange(Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
    };

    return (
        <div className="flex items-center gap-3">
            <label className="shrink-0 text-sm font-medium text-gray-700 inline-16" htmlFor={`${unit}-input`}>
                {label}
            </label>
            <input
                className="rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-semibold inline-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                id={`${unit}-input`}
                min={0}
                onChange={handleChange}
                type="number"
                value={value}
            />
            <span className="shrink-0 text-sm text-gray-500">{unit}</span>
            <span className="ms-auto shrink-0 text-xs whitespace-nowrap text-gray-400">
                Best: {best === null ? "—" : `${best} ${unit}`}
            </span>
        </div>
    );
};
