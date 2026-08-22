import { useCallback, useEffect, useState } from "react";
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

    const handleSelectMachine = useCallback((machine: Machine): void => {
        const load = async (): Promise<void> => {
            setExercises(await getExercises(machine.id));
            setView({ kind: "exercises", machine });
        };

        void load();
    }, []);

    const handleSelectExercise = useCallback((exercise: Exercise): void => {
        setView((current) => {
            if (current.kind !== "exercises") {
                return current;
            }
            return { exercise, kind: "form", machine: current.machine };
        });
    }, []);

    const handleBackToMachines = useCallback((): void => {
        setView({ kind: "machines" });
    }, []);

    const handleBackToExercises = useCallback((): void => {
        setView((current) => {
            if (current.kind !== "form") {
                return current;
            }
            return { kind: "exercises", machine: current.machine };
        });
    }, []);

    const renderContent = (): ReactElement => {
        if (view.kind === "machines") {
            return <MachineList machines={machines} onSelect={handleSelectMachine} />;
        }

        if (view.kind === "exercises") {
            const { machine } = view;

            return (
                <ExerciseList
                    exercises={exercises}
                    machine={machine}
                    onBack={handleBackToMachines}
                    onSelect={handleSelectExercise}
                />
            );
        }

        const { machine, exercise } = view;

        return <ExerciseForm exercise={exercise} machine={machine} onBack={handleBackToExercises} />;
    };

    return <div className="mx-auto max-inline-lg">{renderContent()}</div>;
};
