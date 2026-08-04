import type React from "react";
import { useEffect, useState } from "react";

import { Temporal } from "temporal-polyfill";

import { getExerciseMax, getTodaysRecords, recordExercise } from "../services/mock-api";
import type { Exercise, ExerciseMax, ExerciseRecord, Machine } from "../types/fitness";

interface ExerciseFormProperties {
    machine: Machine;
    exercise: Exercise;
    onBack: () => void;
}

function formatTime(isoString: string): string {
    const instant = Temporal.Instant.from(isoString);

    return instant.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
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
        const controller = new AbortController();

        void (async () => {
            // eslint-disable-next-line @typescript-eslint/init-declarations -- initialized in try
            let maxData: ExerciseMax | null;
            // eslint-disable-next-line @typescript-eslint/init-declarations -- initialized in try
            let todayData: ExerciseRecord[];

            try {
                // Pass controller.signal to your fetch calls if they support it
                [maxData, todayData] = await Promise.all([getExerciseMax(exercise.id), getTodaysRecords(exercise.id)]);
            } catch (error: unknown) {
                if (Error.isError(error) && error.name !== "AbortError") {
                    throw error;
                }

                return;
            }

            if (!controller.signal.aborted) {
                setMax(maxData);
                setTodaysRecords(todayData);

                // Pre-fill with today's most recent values if exercise was done today
                const latest = todayData[0];
                if (latest !== undefined) {
                    setLbs(latest.lbs);
                    setSets(latest.sets);
                    setReps(latest.reps);
                }
            }
        })();

        return () => {
            controller.abort();
        };
    }, [exercise.id]);

    const handleSave = async (): Promise<void> => {
        if (isSaving || lbs <= 0 || sets <= 0 || reps <= 0) {
            return;
        }

        setIsSaving(true);
        await recordExercise(exercise.id, lbs, sets, reps);

        const [updatedMax, updatedToday] = await Promise.all([
            getExerciseMax(exercise.id),
            getTodaysRecords(exercise.id),
        ]);

        setMax(updatedMax);
        setTodaysRecords(updatedToday);
        setSaveCount((n) => {
            return n + 1;
        });
        setIsSaving(false);
    };

    const isValid = lbs > 0 && sets > 0 && reps > 0;

    return (
        <div>
            <button
                onClick={onBack}
                className="
                  mb-4 flex items-center gap-1 text-sm font-medium text-blue-600
                  hover:text-blue-800
                "
            >
                ← Back to exercises
            </button>

            <h1 className="mb-1 text-2xl font-bold text-gray-900">{exercise.name}</h1>
            <p className="mb-6 text-sm text-gray-500">{machine.name}</p>

            {/* Entry form */}
            <div
                className="
                  mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm
                "
            >
                <div className="flex flex-col gap-5">
                    {/* Weight */}
                    <div className="flex items-center gap-3">
                        <label
                            className="
                              w-16 shrink-0 text-sm font-medium text-gray-700
                            "
                        >
                            Weight
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={lbs}
                            onChange={(event) => {
                                const v = Number(event.target.value);
                                setLbs(Number.isNaN(v) ? 0 : Math.max(0, v));
                            }}
                            className="
                              w-24 rounded-lg border border-gray-300 px-3 py-2
                              text-center text-lg font-semibold
                              focus:ring-2 focus:ring-blue-500
                              focus:outline-none
                            "
                        />
                        <span className="shrink-0 text-sm text-gray-500">lbs</span>
                        <span
                            className="
                              ml-auto shrink-0 text-xs whitespace-nowrap
                              text-gray-400
                            "
                        >
                            Best: {max === null ? "—" : `${String(max.lbs)} lbs`}
                        </span>
                    </div>

                    {/* Sets */}
                    <div className="flex items-center gap-3">
                        <label
                            className="
                              w-16 shrink-0 text-sm font-medium text-gray-700
                            "
                        >
                            Sets
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={sets}
                            onChange={(event) => {
                                const v = Number(event.target.value);
                                setSets(Number.isNaN(v) ? 0 : Math.max(0, v));
                            }}
                            className="
                              w-24 rounded-lg border border-gray-300 px-3 py-2
                              text-center text-lg font-semibold
                              focus:ring-2 focus:ring-blue-500
                              focus:outline-none
                            "
                        />
                        <span className="shrink-0 text-sm text-gray-500">sets</span>
                        <span
                            className="
                              ml-auto shrink-0 text-xs whitespace-nowrap
                              text-gray-400
                            "
                        >
                            Best: {max === null ? "—" : `${String(max.sets)} sets`}
                        </span>
                    </div>

                    {/* Reps */}
                    <div className="flex items-center gap-3">
                        <label
                            className="
                              w-16 shrink-0 text-sm font-medium text-gray-700
                            "
                        >
                            Reps
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={reps}
                            onChange={(error) => {
                                const v = Number(error.target.value);
                                setReps(Number.isNaN(v) ? 0 : Math.max(0, v));
                            }}
                            className="
                              w-24 rounded-lg border border-gray-300 px-3 py-2
                              text-center text-lg font-semibold
                              focus:ring-2 focus:ring-blue-500
                              focus:outline-none
                            "
                        />
                        <span className="shrink-0 text-sm text-gray-500">reps</span>
                        <span
                            className="
                              ml-auto shrink-0 text-xs whitespace-nowrap
                              text-gray-400
                            "
                        >
                            Best: {max === null ? "—" : `${String(max.reps)} reps`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        void handleSave();
                    }}
                    disabled={!isValid || isSaving}
                    className="
                      mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold
                      text-white transition-colors
                      hover:bg-blue-700
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      focus:outline-none
                      disabled:cursor-not-allowed disabled:opacity-40
                    "
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>

                {saveCount > 0 && (
                    <p className="mt-3 text-center text-sm text-green-600">
                        {saveCount} {saveCount === 1 ? "set" : "sets"} recorded today
                    </p>
                )}
            </div>

            {/* Today's history */}
            {todaysRecords.length > 0 && (
                <div>
                    <h2
                        className="
                          mb-3 text-xs font-semibold tracking-widest
                          text-gray-400 uppercase
                        "
                    >
                        Today&apos;s sets
                    </h2>
                    <div className="flex flex-col gap-2">
                        {todaysRecords.map((record, index) => {
                            return (
                                <div
                                    key={record.id}
                                    className="
                                      flex items-center gap-3 rounded-lg border
                                      border-gray-200 bg-white px-4 py-3
                                    "
                                >
                                    <span
                                        className="
                                          w-12 shrink-0 text-xs text-gray-400
                                        "
                                    >
                                        {formatTime(record.timestamp)}
                                    </span>
                                    <span
                                        className="
                                          text-sm font-semibold text-gray-800
                                        "
                                    >
                                        {record.lbs} lbs
                                    </span>
                                    <span className="text-sm text-gray-400">×</span>
                                    <span className="text-sm text-gray-700">{record.sets} sets</span>
                                    <span className="text-sm text-gray-400">×</span>
                                    <span className="text-sm text-gray-700">{record.reps} reps</span>
                                    {index === 0 && (
                                        <span
                                            className="
                                              ml-auto shrink-0 rounded-full
                                              bg-blue-50 px-2 py-0.5 text-xs
                                              text-blue-600
                                            "
                                        >
                                            latest
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
