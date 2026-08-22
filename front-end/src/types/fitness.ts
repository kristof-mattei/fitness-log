export interface Machine {
    id: string;
    name: string;
}

export interface Exercise {
    id: string;
    machineId: string;
    name: string;
}

export interface ExerciseRecord {
    exerciseId: string;
    id: string;
    lbs: number;
    reps: number;
    sets: number;
    timestamp: string;
}

export interface ExerciseMax {
    lbs: number;
    reps: number;
    sets: number;
}
