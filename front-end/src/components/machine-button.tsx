import { useCallback } from "react";
import type React from "react";

import type { Machine } from "../types/fitness";

interface MachineButtonProperties {
    machine: Machine;
    onSelect: (machine: Machine) => void;
}

export const MachineButton: React.FC<MachineButtonProperties> = ({ machine, onSelect }) => {
    const handleClick = useCallback((): void => {
        onSelect(machine);
    }, [machine, onSelect]);

    return (
        <button
            className="rounded-xl border border-gray-200 bg-white p-5 text-start shadow-sm transition-all duration-150 hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onClick={handleClick}
            type="button"
        >
            <span className="text-sm font-semibold text-gray-800">{machine.name}</span>
        </button>
    );
};
