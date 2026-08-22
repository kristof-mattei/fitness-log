import type React from "react";

import type { Machine } from "../types/fitness";
import { MachineButton } from "./machine-button";

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
                    return <MachineButton key={machine.id} machine={machine} onSelect={onSelect} />;
                })}
            </div>
        </div>
    );
};
