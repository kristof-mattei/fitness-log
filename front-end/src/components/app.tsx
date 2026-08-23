import { useEffect, useState } from "react";
import type { FC, ReactElement } from "react";

import { getExercises, getMachines } from "../services/mock-api";
import type { Exercise, Machine } from "../types/fitness";
import { ExerciseForm } from "./exercise-form";
import { ExerciseList } from "./exercise-list";
import { MachineList } from "./machine-list";

type AppView =
    | { exercise: Exercise; kind: "form"; machine: Machine }
    | { kind: "exercises"; machine: Machine }
    | { kind: "machines" };

export const App: FC = () => {
    const [view, setView] = useState<AppView>({ kind: "machines" });
    const [machines, setMachines] = useState<Machine[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        const load = async (): Promise<void> => {
            setMachines(await getMachines());
        };

        void load();
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

        setView({ exercise, kind: "form", machine: view.machine });
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
                        exercises={exercises}
                        machine={machine}
                        onBack={() => {
                            setView({ kind: "machines" });
                        }}
                        onSelect={handleSelectExercise}
                    />
                );
            }
            case "form": {
                const { machine, exercise } = view;

                return (
                    <ExerciseForm
                        exercise={exercise}
                        machine={machine}
                        onBack={() => {
                            setView({ kind: "exercises", machine });
                        }}
                    />
                );
            }
        }
    };

    return <div className="mx-auto max-inline-lg">{renderContent()}</div>;
};
