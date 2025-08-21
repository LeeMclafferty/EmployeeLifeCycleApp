import { useEffect, useMemo, useState } from "react";
import {
    LifeCyclePhase,
    type PersonRecord,
} from "../../../types/PersonRecordType";
import { getDisplayName } from "../../../helpers/formattingHelpers";
import "./ChangePhaseModal.css";
import { updatePersonRecordPhase } from "../../../api/PersonRecordApi";
import { sendTeamsNotification } from "../../../api/NoifyApi";
import { type NotifyBody } from "../../../types/NotifyTypes";

type Props = {
    personRecords: PersonRecord[];
    onPhaseChangeComplete: () => void;
};

const ChangePhaseModal = ({ personRecords, onPhaseChangeComplete }: Props) => {
    const [selectedRecords, setSelectedRecords] = useState<PersonRecord[]>([]);
    const [selectedToPhase, setSelectedToPhase] = useState<LifeCyclePhase>(
        LifeCyclePhase.Onboarding
    );
    const [selectedFromPhase, setSelectedFromPhase] = useState<LifeCyclePhase>(
        LifeCyclePhase.Draft
    );
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<number, string>>({});
    const [notes, setNotes] = useState<Record<number, string>>({});

    const displayRecords = useMemo(
        () => personRecords.filter((r) => r.phase === selectedFromPhase),
        [personRecords, selectedFromPhase]
    );

    useEffect(() => {
        setSelectedRecords([]);
    }, [selectedToPhase]);

    const toggleCheckbox = (p: PersonRecord) => {
        setSelectedRecords((prev) =>
            prev.some((x) => x.id === p.id)
                ? prev.filter((x) => x.id !== p.id)
                : [...prev, p]
        );
    };

    const channelForPhase = (phase: LifeCyclePhase) => {
        switch (phase) {
            case LifeCyclePhase.Onboarding:
                return "Onboarding";
            case LifeCyclePhase.Offboarded:
                return "Offboarding";
            default:
                return "";
        }
    };

    // --- helpers ---
    const getUpdatableRecords = () =>
        selectedRecords.filter(
            (r): r is PersonRecord & { id: number } => r.id != null
        );

    const applyPhaseUpdates = async (
        recs: (PersonRecord & { id: number })[]
    ) => {
        const results = await Promise.allSettled(
            recs.map((r) => updatePersonRecordPhase(r.id, selectedToPhase))
        );

        const errs: Record<number, string> = {};
        const successRecs: typeof recs = [];

        results.forEach((res, i) => {
            const rec = recs[i];
            if (res.status === "rejected") {
                errs[rec.id] = String(res.reason);
            } else {
                successRecs.push(rec);
            }
        });

        return { errs, successRecs };
    };

    const buildMessageHtml = (records: (PersonRecord & { id: number })[]) => {
        // sort by start date
        const sorted = [...records].sort((a, b) => {
            const da = a.startDate ? new Date(a.startDate).getTime() : 0;
            const db = b.startDate ? new Date(b.startDate).getTime() : 0;
            return da - db;
        });

        const rows = sorted.map((r) => {
            const dept = r.department?.displayName ?? "Unknown Dept";
            const name = getDisplayName(r);
            const start = r.startDate
                ? new Date(r.startDate).toLocaleDateString()
                : "No Start Date";
            const link = `<a href="https://localhost:49866/Task/${r.id}">${name}</a>`;

            let row = `<li>${dept} – ${link} ${start}`;

            const note = r.id ? notes[r.id] : "";
            if (note && note.trim() !== "") {
                row += `<ul><li>${note}</li></ul>`;
            }

            row += `</li>`;
            return row;
        });

        return `
                <b>New Team Member(s):</b>
                <ul>
                ${rows.join("")}
                </ul>`;
    };

    const notifyTeams = async (records: (PersonRecord & { id: number })[]) => {
        const lifecyclePhase = channelForPhase(selectedToPhase);
        if (!lifecyclePhase || records.length === 0) return;

        const messageHtml = buildMessageHtml(records);
        const body: NotifyBody = {
            messageHtml,
            lifecyclePhase,
        };
        try {
            await sendTeamsNotification(body);
        } catch (e) {
            console.error("Teams notify failed:", e);
        }
    };

    // --- main submit ---
    const onSubmitClick = async () => {
        setSaving(true);
        setErrors({});

        const updatable = getUpdatableRecords();
        const { errs, successRecs } = await applyPhaseUpdates(updatable);

        setErrors(errs);
        setSaving(false);

        // keep only failures selected
        setSelectedRecords((prev) =>
            prev.filter((r) => r.id != null && errs[r.id!])
        );

        await notifyTeams(successRecs);

        onPhaseChangeComplete();
    };

    return (
        <>
            <div className="phase-changes">
                <div className="move-from-label-container">
                    <label id="phase-select-label">
                        Moving From:
                        <select
                            id="phase-select"
                            value={selectedFromPhase}
                            onChange={(e) =>
                                setSelectedFromPhase(
                                    Number(e.target.value) as LifeCyclePhase
                                )
                            }
                        >
                            {Object.values(LifeCyclePhase)
                                .filter((v) => typeof v === "number")
                                .map((v) => (
                                    <option key={v} value={v}>
                                        {LifeCyclePhase[v as number]}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>
                <div id="label-sep"></div>
                <div className="move-to-label-container">
                    <label id="phase-select-label">
                        Moving To:
                        <select
                            id="phase-select"
                            value={selectedToPhase}
                            onChange={(e) =>
                                setSelectedToPhase(
                                    Number(e.target.value) as LifeCyclePhase
                                )
                            }
                        >
                            {Object.values(LifeCyclePhase)
                                .filter((v) => typeof v === "number")
                                .map((v) => (
                                    <option key={v} value={v}>
                                        {LifeCyclePhase[v as number]}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>
                <div id="submit-container">
                    <button
                        id="submit-btn"
                        onClick={onSubmitClick}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Submit Changes"}
                    </button>
                </div>
            </div>
            <ul>
                {displayRecords.length === 0 && (
                    <li>
                        No people to change—nobody is in{" "}
                        {LifeCyclePhase[selectedFromPhase]}.
                    </li>
                )}
                {displayRecords.map((r) => (
                    <li key={r.id} className="row-outter">
                        <div className="row-inner">
                            <div className="row-content">
                                <input
                                    type="checkbox"
                                    className="check-box"
                                    checked={selectedRecords.some(
                                        (x) => x.id === r.id
                                    )}
                                    onChange={() => toggleCheckbox(r)}
                                />
                                <p className="name">{getDisplayName(r)}</p>
                                <input
                                    type="text"
                                    placeholder="Additional Information"
                                    value={notes[r.id ?? -1] ?? ""}
                                    onChange={(e) =>
                                        r.id != null &&
                                        setNotes((prev) => ({
                                            ...prev,
                                            [r.id!]: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ChangePhaseModal;
