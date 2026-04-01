import type React from "react";
import { useEffect, useState } from "react";

import { getExerciseMax, getTodaysRecords, recordExercise } from "../services/mock-api";
import type { Exercise, ExerciseMax, ExerciseRecord, Machine } from "../types/fitness";

interface ExerciseFormProperties {
    machine: Machine;
    exercise: Exercise;
    onBack: () => void;
}

function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const ExerciseForm: React.FC<ExerciseFormProperties> = ({ machine, exercise, onBack }) => {
    const [lbs, setLbs] = useState(0);
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [max, setMax] = useState<ExerciseMax | null>(null);
    const [todaysRecords, setTodaysRecords] = useState<ExerciseRecord[]>([]);
    const [saving, setSaving] = useState(false);
    const [saveCount, setSaveCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        void (async () => {
            try {
                // Pass controller.signal to your fetch calls if they support it
                const [maxData, todayData] = await Promise.all([
                    getExerciseMax(exercise.id),
                    getTodaysRecords(exercise.id),
                ]);

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
            } catch (error: unknown) {
                if (error instanceof Error && error.name !== "AbortError") {
                    throw error;
                }
            }
        })();

        return () => {
            controller.abort();
        };
    }, [exercise.id]);

    const handleSave = async (): Promise<void> => {
        if (lbs <= 0 || sets <= 0 || reps <= 0 || saving) {
            return;
        }

        setSaving(true);
        await recordExercise(exercise.id, lbs, sets, reps);

        const [newMax, newToday] = await Promise.all([getExerciseMax(exercise.id), getTodaysRecords(exercise.id)]);

        setMax(newMax);
        setTodaysRecords(newToday);
        setSaveCount((n) => {
            return n + 1;
        });
        setSaving(false);
    };

    const isValid = lbs > 0 && sets > 0 && reps > 0;

    return (
        <div>
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium"
            >
                ← Back to exercises
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">{exercise.name}</h1>
            <p className="text-gray-500 text-sm mb-6">{machine.name}</p>

            {/* Entry form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col gap-5">
                    {/* Weight */}
                    <div className="flex items-center gap-3">
                        <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Weight</label>
                        <input
                            type="number"
                            min={0}
                            value={lbs}
                            onChange={(event) => {
                                const v = Number.parseInt(event.target.value, 10);
                                setLbs(Number.isNaN(v) ? 0 : Math.max(0, v));
                            }}
                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500 shrink-0">lbs</span>
                        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap shrink-0">
                            Best: {max === null ? "—" : `${String(max.lbs)} lbs`}
                        </span>
                    </div>

                    {/* Sets */}
                    <div className="flex items-center gap-3">
                        <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Sets</label>
                        <input
                            type="number"
                            min={0}
                            value={sets}
                            onChange={(event) => {
                                const v = Number.parseInt(event.target.value, 10);
                                setSets(Number.isNaN(v) ? 0 : Math.max(0, v));
                            }}
                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500 shrink-0">sets</span>
                        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap shrink-0">
                            Best: {max === null ? "—" : `${String(max.sets)} sets`}
                        </span>
                    </div>

                    {/* Reps */}
                    <div className="flex items-center gap-3">
                        <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Reps</label>
                        <input
                            type="number"
                            min={0}
                            value={reps}
                            onChange={(error) => {
                                const v = Number.parseInt(error.target.value, 10);
                                setReps(Number.isNaN(v) ? 0 : Math.max(0, v));
                            }}
                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500 shrink-0">reps</span>
                        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap shrink-0">
                            Best: {max === null ? "—" : `${String(max.reps)} reps`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        void handleSave();
                    }}
                    disabled={!isValid || saving}
                    className="mt-6 w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {saving ? "Saving…" : "Save"}
                </button>

                {saveCount > 0 && (
                    <p className="text-center text-sm text-green-600 mt-3">
                        {saveCount} {saveCount === 1 ? "set" : "sets"} recorded today
                    </p>
                )}
            </div>

            {/* Today's history */}
            {todaysRecords.length > 0 && (
                <div>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Today&apos;s sets
                    </h2>
                    <div className="flex flex-col gap-2">
                        {todaysRecords.map((record, index) => {
                            return (
                                <div
                                    key={record.id}
                                    className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-3"
                                >
                                    <span className="text-xs text-gray-400 w-12 shrink-0">
                                        {formatTime(record.timestamp)}
                                    </span>
                                    <span className="font-semibold text-gray-800 text-sm">{record.lbs} lbs</span>
                                    <span className="text-gray-400 text-sm">×</span>
                                    <span className="text-gray-700 text-sm">{record.sets} sets</span>
                                    <span className="text-gray-400 text-sm">×</span>
                                    <span className="text-gray-700 text-sm">{record.reps} reps</span>
                                    {index === 0 && (
                                        <span className="ml-auto text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full shrink-0">
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
