import type React from "react";

import type { Exercise, Machine } from "../types/fitness";

interface ExerciseListProperties {
    machine: Machine;
    exercises: Exercise[];
    onSelect: (exercise: Exercise) => void;
    onBack: () => void;
}

export const ExerciseList: React.FC<ExerciseListProperties> = ({ machine, exercises, onSelect, onBack }) => {
    return (
        <div>
            <button
                onClick={onBack}
                className="
                  mb-4 flex items-center gap-1 text-sm font-medium text-blue-600
                  hover:text-blue-800
                "
            >
                ← Back to machines
            </button>
            <h1 className="mb-1 text-2xl font-bold text-gray-900">{machine.name}</h1>
            <p className="mb-6 text-sm text-gray-500">Select an exercise</p>
            <div className="flex flex-col gap-3">
                {exercises.map((exercise) => {
                    return (
                        <button
                            key={exercise.id}
                            onClick={() => {
                                onSelect(exercise);
                            }}
                            className="
                              rounded-xl border border-gray-200 bg-white p-4
                              text-left shadow-sm transition-all duration-150
                              hover:border-blue-400 hover:shadow-md
                              focus:ring-2 focus:ring-blue-500
                              focus:outline-none
                            "
                        >
                            <span className="font-medium text-gray-800">{exercise.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
