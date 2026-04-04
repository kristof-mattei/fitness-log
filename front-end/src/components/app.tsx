import { useEffect, useState } from "react";
import type React from "react";
import type { ReactElement } from "react";

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

    const handleSelectMachine = async (machine: Machine): Promise<void> => {
        const list = await getExercises(machine.id);

        setExercises(list);
        setView({ kind: "exercises", machine });
    };

    const handleSelectExercise = (exercise: Exercise): void => {
        if (view.kind !== "exercises") {
            return;
        }
        setView({ kind: "form", machine: view.machine, exercise });
    };

    const renderContent = (): ReactElement => {
        switch (view.kind) {
            case "machines": {
                return (
                    <MachineList
                        machines={machines}
                        onSelect={(machine) => {
                            void handleSelectMachine(machine);
                        }}
                    />
                );
            }
            case "exercises": {
                const { machine } = view;

                return (
                    <ExerciseList
                        machine={machine}
                        exercises={exercises}
                        onSelect={handleSelectExercise}
                        onBack={() => {
                            setView({ kind: "machines" });
                        }}
                    />
                );
            }
            default: {
                const { machine, exercise } = view;

                return (
                    <ExerciseForm
                        machine={machine}
                        exercise={exercise}
                        onBack={() => {
                            setView({ kind: "exercises", machine });
                        }}
                    />
                );
            }
        }
    };

    return <div className="max-w-lg mx-auto">{renderContent()}</div>;
};
