import type React from "react";

import type { ExerciseRecord } from "../types/fitness";
import { RecordRow } from "./record-row";

interface TodaysRecordsProperties {
    records: ExerciseRecord[];
}

export const TodaysRecords: React.FC<TodaysRecordsProperties> = ({ records }) => {
    return (
        <div>
            <h2 className="mbe-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">Today&apos;s sets</h2>
            <div className="flex flex-col gap-2">
                {records.map((record, index) => {
                    return <RecordRow isLatest={index === 0} key={record.id} record={record} />;
                })}
            </div>
        </div>
    );
};
