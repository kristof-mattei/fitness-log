import type React from "react";

import type { Machine } from "../types/fitness";

interface MachineListProperties {
    machines: Machine[];
    onSelect: (machine: Machine) => void;
}

export const MachineList: React.FC<MachineListProperties> = ({ machines, onSelect }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Fitness Log</h1>
            <p className="text-gray-500 text-sm mb-6">Select a machine to get started.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {machines.map((machine) => {
                    return (
                        <button
                            key={machine.id}
                            onClick={() => {
                                onSelect(machine);
                            }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-left hover:border-blue-400 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="font-semibold text-gray-800 text-sm">{machine.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
