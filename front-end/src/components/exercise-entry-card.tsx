import { useCallback } from "react";
import type React from "react";

import type { ExerciseMax } from "../types/fitness";
import { NumberInputRow } from "./number-input-row";

interface ExerciseEntryCardProperties {
    isSaving: boolean;
    lbs: number;
    max: ExerciseMax | null;
    onLbsChange: (value: number) => void;
    onRepsChange: (value: number) => void;
    onSave: () => Promise<void>;
    onSetsChange: (value: number) => void;
    reps: number;
    saveCount: number;
    sets: number;
}

export const ExerciseEntryCard: React.FC<ExerciseEntryCardProperties> = ({
    isSaving,
    lbs,
    max,
    onLbsChange,
    onRepsChange,
    onSave,
    onSetsChange,
    reps,
    saveCount,
    sets,
}) => {
    const handleSaveClick = useCallback((): void => {
        void onSave();
    }, [onSave]);

    const isValid = lbs > 0 && sets > 0 && reps > 0;

    return (
        <div className="mbe-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5">
                <NumberInputRow
                    best={max?.lbs ?? null}
                    label="Weight"
                    onValueChange={onLbsChange}
                    unit="lbs"
                    value={lbs}
                />
                <NumberInputRow
                    best={max?.sets ?? null}
                    label="Sets"
                    onValueChange={onSetsChange}
                    unit="sets"
                    value={sets}
                />
                <NumberInputRow
                    best={max?.reps ?? null}
                    label="Reps"
                    onValueChange={onRepsChange}
                    unit="reps"
                    value={reps}
                />
            </div>

            <button
                className="mbs-6 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors inline-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!isValid || isSaving}
                onClick={handleSaveClick}
                type="button"
            >
                {isSaving ? "Saving..." : "Save"}
            </button>

            {saveCount > 0 && (
                <p className="mbs-3 text-center text-sm text-green-600">
                    {saveCount} {saveCount === 1 ? "set" : "sets"} recorded today
                </p>
            )}
        </div>
    );
};
