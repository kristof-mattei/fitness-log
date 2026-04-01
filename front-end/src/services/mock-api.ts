import type { Exercise, ExerciseMax, ExerciseRecord, Machine } from "../types/fitness";

const MACHINES: Machine[] = [
    { id: "leg-press", name: "Leg Press" },
    { id: "leg-extension", name: "Leg Extension" },
    { id: "leg-curl", name: "Leg Curl" },
    { id: "chest-press", name: "Chest Press" },
    { id: "shoulder-press", name: "Shoulder Press" },
    { id: "lat-pulldown", name: "Lat Pulldown" },
    { id: "cable-row", name: "Seated Cable Row" },
    { id: "tricep-pushdown", name: "Tricep Pushdown" },
    { id: "bicep-curl", name: "Bicep Curl" },
    { id: "calf-raise", name: "Calf Raise" },
];

const EXERCISES: Exercise[] = [
    { id: "leg-press-standard", machineId: "leg-press", name: "Leg Press" },
    { id: "leg-press-narrow", machineId: "leg-press", name: "Narrow Stance Leg Press" },
    { id: "leg-extension-bilateral", machineId: "leg-extension", name: "Leg Extension" },
    { id: "leg-extension-unilateral", machineId: "leg-extension", name: "Single Leg Extension" },
    { id: "leg-curl-seated", machineId: "leg-curl", name: "Seated Leg Curl" },
    { id: "leg-curl-single", machineId: "leg-curl", name: "Single Leg Curl" },
    { id: "chest-press-flat", machineId: "chest-press", name: "Chest Press" },
    { id: "chest-press-incline", machineId: "chest-press", name: "Incline Chest Press" },
    { id: "shoulder-press-standard", machineId: "shoulder-press", name: "Shoulder Press" },
    { id: "lat-pulldown-wide", machineId: "lat-pulldown", name: "Wide Grip Lat Pulldown" },
    { id: "lat-pulldown-close", machineId: "lat-pulldown", name: "Close Grip Lat Pulldown" },
    { id: "cable-row-standard", machineId: "cable-row", name: "Seated Cable Row" },
    { id: "tricep-pushdown-bar", machineId: "tricep-pushdown", name: "Tricep Pushdown (Bar)" },
    { id: "tricep-pushdown-rope", machineId: "tricep-pushdown", name: "Tricep Pushdown (Rope)" },
    { id: "bicep-curl-standard", machineId: "bicep-curl", name: "Bicep Curl" },
    { id: "bicep-curl-hammer", machineId: "bicep-curl", name: "Hammer Curl" },
    { id: "calf-raise-standing", machineId: "calf-raise", name: "Standing Calf Raise" },
    { id: "calf-raise-seated", machineId: "calf-raise", name: "Seated Calf Raise" },
];

const RECORDS_KEY = "fitness_records";

function getStoredRecords(): ExerciseRecord[] {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (raw === null) {
        return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- API is trusted
    return JSON.parse(raw) as ExerciseRecord[];
}

function persistRecords(records: ExerciseRecord[]): void {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// eslint-disable-next-line require-await, @typescript-eslint/require-await -- MOCK
export async function getMachines(): Promise<Machine[]> {
    return [...MACHINES];
}

// eslint-disable-next-line require-await, @typescript-eslint/require-await -- MOCK
export async function getExercises(machineId: string): Promise<Exercise[]> {
    return EXERCISES.filter((exercise) => {
        return exercise.machineId === machineId;
    });
}

// eslint-disable-next-line require-await, @typescript-eslint/require-await -- MOCK
export async function getExerciseMax(exerciseId: string): Promise<ExerciseMax | null> {
    const records = getStoredRecords().filter((r) => {
        return r.exerciseId === exerciseId;
    });
    if (records.length === 0) {
        return null;
    }
    return {
        lbs: Math.max(
            ...records.map((r) => {
                return r.lbs;
            }),
        ),
        sets: Math.max(
            ...records.map((r) => {
                return r.sets;
            }),
        ),
        reps: Math.max(
            ...records.map((r) => {
                return r.reps;
            }),
        ),
    };
}

// eslint-disable-next-line require-await, @typescript-eslint/require-await -- MOCK
export async function getTodaysRecords(exerciseId: string): Promise<ExerciseRecord[]> {
    const today = new Date().toDateString();
    return getStoredRecords()
        .filter((r) => {
            return r.exerciseId === exerciseId && new Date(r.timestamp).toDateString() === today;
        })
        .sort((a, b) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
}

// eslint-disable-next-line require-await, @typescript-eslint/require-await -- MOCK
export async function recordExercise(
    exerciseId: string,
    lbs: number,
    sets: number,
    reps: number,
): Promise<ExerciseRecord> {
    const record: ExerciseRecord = {
        id: crypto.randomUUID(),
        exerciseId,
        lbs,
        sets,
        reps,
        timestamp: new Date().toISOString(),
    };
    const records = getStoredRecords();
    records.push(record);
    persistRecords(records);
    return record;
}
