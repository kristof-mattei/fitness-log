import type React from "react";
import { useEffect, useState } from "react";

import { getExercises, getMachines } from "../services/mock-api";

import type { Exercise, Machine } from "../types/fitness";

import { ExerciseForm } from "./exercise-form";
import { ExerciseList } from "./exercise-list";
import { MachineList } from "./machine-list";

type AppView =
    | { kind: "exercises"; machine: Machine }
    | { kind: "form"; machine: Machine; exercise: Exercise }
    | { kind: "machines" };

export const App: React.FC = () => {
    const [view, setView] = useState<AppView>({ kind: "machines" });
    const [machines, setMachines] = useState<Machine[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        void getMachines().then(setMachines);
    }, []);

    const handleSelectMachine = (machine: Machine): void => {
        void getExercises(machine.id).then((list) => {
            setExercises(list);
            setView({ kind: "exercises", machine });
        });
    };

    const handleSelectExercise = (exercise: Exercise): void => {
        if (view.kind !== "exercises") {
            return;
        }
        setView({ kind: "form", machine: view.machine, exercise });
    };

    // eslint-disable-next-line @typescript-eslint/init-declarations -- initialized below
    let content: React.ReactNode;

    if (view.kind === "machines") {
        content = <MachineList machines={machines} onSelect={handleSelectMachine} />;
    } else if (view.kind === "exercises") {
        const { machine } = view;
        content = (
            <ExerciseList
                machine={machine}
                exercises={exercises}
                onSelect={handleSelectExercise}
                onBack={() => {
                    setView({ kind: "machines" });
                }}
            />
        );
    } else {
        const { machine, exercise } = view;

        content = (
            <ExerciseForm
                machine={machine}
                exercise={exercise}
                onBack={() => {
                    setView({ kind: "exercises", machine });
                }}
            />
        );
    }

    return <div className="max-w-lg mx-auto">{content}</div>;
};
