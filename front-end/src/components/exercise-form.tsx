import { useEffect, useState } from "react";
import type React from "react";

import { getExerciseMax, getTodaysRecords, recordExercise } from "../services/mock-api";
import type { Exercise, ExerciseMax, ExerciseRecord, Machine } from "../types/fitness";
import { ExerciseEntryCard } from "./exercise-entry-card";
import { TodaysRecords } from "./todays-records";

interface ExerciseFormProperties {
    exercise: Exercise;
    machine: Machine;
    onBack: () => void;
}

async function loadExerciseData(exerciseId: string): Promise<[ExerciseMax | null, ExerciseRecord[]] | null> {
    try {
        return await Promise.all([getExerciseMax(exerciseId), getTodaysRecords(exerciseId)]);
    } catch (error: unknown) {
        if (Error.isError(error) && error.name !== "AbortError") {
            throw error;
        }

        return null;
    }
}

export const ExerciseForm: React.FC<ExerciseFormProperties> = ({ machine, exercise, onBack }) => {
    const [lbs, setLbs] = useState(0);
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [max, setMax] = useState<ExerciseMax | null>(null);
    const [todaysRecords, setTodaysRecords] = useState<ExerciseRecord[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveCount, setSaveCount] = useState(0);

    useEffect(() => {
        // TODO: the mock API accepts no AbortSignal, so this controller cancels nothing. The `aborted` check below
        // only suppresses a post-unmount setState, and the AbortError branch in `loadExerciseData` stays unreachable
        // until the signal is passed through.
        const controller = new AbortController();

        const load = async (): Promise<void> => {
            const loaded = await loadExerciseData(exercise.id);

            if (loaded === null || controller.signal.aborted) {
                return;
            }

            const [maxData, todayData] = loaded;

            setMax(maxData);
            setTodaysRecords(todayData);

            // Pre-fill with today's most recent values if exercise was done today
            const latest = todayData[0];

            if (latest !== undefined) {
                setLbs(latest.lbs);
                setSets(latest.sets);
                setReps(latest.reps);
            }
        };

        void load();

        return (): void => {
            controller.abort();
        };
    }, [exercise.id]);

    const handleSave = async (): Promise<void> => {
        if (isSaving || lbs <= 0 || sets <= 0 || reps <= 0) {
            return;
        }

        setIsSaving(true);
        await recordExercise({ exerciseId: exercise.id, lbs, reps, sets });

        const [updatedMax, updatedToday] = await Promise.all([
            getExerciseMax(exercise.id),
            getTodaysRecords(exercise.id),
        ]);

        setMax(updatedMax);
        setTodaysRecords(updatedToday);
        setSaveCount((count) => {
            return count + 1;
        });
        setIsSaving(false);
    };

    return (
        <div>
            <button
                className="mbe-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                onClick={onBack}
                type="button"
            >
                ← Back to exercises
            </button>

            <h1 className="mbe-1 text-2xl font-bold text-gray-900">{exercise.name}</h1>
            <p className="mbe-6 text-sm text-gray-500">{machine.name}</p>

            <ExerciseEntryCard
                isSaving={isSaving}
                lbs={lbs}
                max={max}
                onLbsChange={setLbs}
                onRepsChange={setReps}
                onSave={handleSave}
                onSetsChange={setSets}
                reps={reps}
                saveCount={saveCount}
                sets={sets}
            />

            {todaysRecords.length > 0 && <TodaysRecords records={todaysRecords} />}
        </div>
    );
};
