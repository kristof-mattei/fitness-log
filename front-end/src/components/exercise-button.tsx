import { useCallback } from "react";
import type React from "react";

import type { Exercise } from "../types/fitness";

interface ExerciseButtonProperties {
    exercise: Exercise;
    onSelect: (exercise: Exercise) => void;
}

export const ExerciseButton: React.FC<ExerciseButtonProperties> = ({ exercise, onSelect }) => {
    const handleClick = useCallback((): void => {
        onSelect(exercise);
    }, [exercise, onSelect]);

    return (
        <button
            className="rounded-xl border border-gray-200 bg-white p-4 text-start shadow-sm transition-all duration-150 hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onClick={handleClick}
            type="button"
        >
            <span className="font-medium text-gray-800">{exercise.name}</span>
        </button>
    );
};
