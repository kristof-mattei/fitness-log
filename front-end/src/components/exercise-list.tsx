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
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium"
            >
                ← Back to machines
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{machine.name}</h1>
            <p className="text-gray-500 text-sm mb-6">Select an exercise</p>
            <div className="flex flex-col gap-3">
                {exercises.map((exercise) => {
                    return (
                        <button
                            key={exercise.id}
                            onClick={() => {
                                onSelect(exercise);
                            }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-left hover:border-blue-400 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <span className="font-medium text-gray-800">{exercise.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
