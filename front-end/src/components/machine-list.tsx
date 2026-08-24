import type React from "react";

import type { Machine } from "../types/fitness";

interface MachineListProperties {
    machines: Machine[];
    onSelect: (machine: Machine) => void;
}

export const MachineList: React.FC<MachineListProperties> = ({ machines, onSelect }) => {
    return (
        <div>
            <h1 className="mbe-2 text-2xl font-bold text-gray-900">Fitness Log</h1>
            <p className="mbe-6 text-sm text-gray-500">Select a machine to get started.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {machines.map((machine) => {
                    return (
                        <button
                            className="rounded-xl border border-gray-200 bg-white p-5 text-start shadow-sm transition-all duration-150 hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            key={machine.id}
                            onClick={() => {
                                onSelect(machine);
                            }}
                            type="button"
                        >
                            <span className="text-sm font-semibold text-gray-800">{machine.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
