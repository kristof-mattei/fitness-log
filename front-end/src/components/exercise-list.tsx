import type React from "react";

import type { Exercise, Machine } from "../types/fitness";
import { ExerciseButton } from "./exercise-button";

interface ExerciseListProperties {
    exercises: Exercise[];
    machine: Machine;
    onBack: () => void;
    onSelect: (exercise: Exercise) => void;
}

export const ExerciseList: React.FC<ExerciseListProperties> = ({ machine, exercises, onSelect, onBack }) => {
    return (
        <div>
            <button
                className="mbe-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                onClick={onBack}
                type="button"
            >
                ← Back to machines
            </button>
            <h1 className="mbe-1 text-2xl font-bold text-gray-900">{machine.name}</h1>
            <p className="mbe-6 text-sm text-gray-500">Select an exercise</p>
            <div className="flex flex-col gap-3">
                {exercises.map((exercise) => {
                    return <ExerciseButton exercise={exercise} key={exercise.id} onSelect={onSelect} />;
                })}
            </div>
        </div>
    );
};
