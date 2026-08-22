import type React from "react";
import { Temporal } from "temporal-polyfill";

import type { ExerciseRecord } from "../types/fitness";

interface RecordRowProperties {
    isLatest: boolean;
    record: ExerciseRecord;
}

function formatTime(isoString: string): string {
    const instant = Temporal.Instant.from(isoString);

    return instant.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
}

export const RecordRow: React.FC<RecordRowProperties> = ({ isLatest, record }) => {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
            <span className="shrink-0 text-xs text-gray-400 inline-12">{formatTime(record.timestamp)}</span>
            <span className="text-sm font-semibold text-gray-800">{record.lbs} lbs</span>
            <span className="text-sm text-gray-400">×</span>
            <span className="text-sm text-gray-700">{record.sets} sets</span>
            <span className="text-sm text-gray-400">×</span>
            <span className="text-sm text-gray-700">{record.reps} reps</span>
            {isLatest && (
                <span className="ms-auto shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                    latest
                </span>
            )}
        </div>
    );
};
