import { useEffect, useMemo, useState } from "react";
import {
    LifeCyclePhase,
    type PersonRecord,
} from "../../../types/PersonRecordType";
import { getDisplayName } from "../../../helpers/formattingHelpers";
import "./ChangePhaseModal.css";
import { updatePersonRecordPhase } from "../../../api/PersonRecordApi";
import {
    MICROSOFT_CHANNEL_ID,
    MICROSOFT_TEAM_ID,
} from "../../../constants/constants";
import { type NotifyBody } from "../../../types/NotifyTypes";
import { sendTeamsNotification } from "../../../api/NoifyApi";

type Props = {
    personRecords: PersonRecord[];
    onPhaseChangeComplete: () => void;
};
const ChangePhaseModal = ({ personRecords, onPhaseChangeComplete }: Props) => {
    const [selectedRecords, setSelectedRecords] = useState<PersonRecord[]>([]);
    const [selectedPhase, setSelectedPhase] = useState<LifeCyclePhase>(
        LifeCyclePhase.Active
    );
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<number, string>>({});

    const displayRecords = useMemo(
        () => personRecords.filter((r) => r.phase !== selectedPhase),
        [personRecords, selectedPhase]
    );

    useEffect(() => {
        setSelectedRecords([]);
    }, [selectedPhase]);

    const toggleCheckbox = (p: PersonRecord) => {
        setSelectedRecords(
            (prev) =>
                prev.some((x) => x.id === p.id) // already selected?
                    ? prev.filter((x) => x.id !== p.id) // remove it
                    : [...prev, p] // add it
        );
        console.log(selectedRecords);
    };

    const channelForPhase = (
        phase: LifeCyclePhase
    ): { teamId: string; channelId: string } | null => {
        switch (phase) {
            case LifeCyclePhase.Onboarding:
                return {
                    teamId: MICROSOFT_TEAM_ID,
                    channelId: MICROSOFT_CHANNEL_ID.onboarding,
                };
            case LifeCyclePhase.Offboarded:
                return {
                    teamId: MICROSOFT_TEAM_ID,
                    channelId: MICROSOFT_CHANNEL_ID.offboarding,
                };
            default:
                return null;
        }
    };

    const onSubmitClick = async () => {
        setSaving(true);
        setErrors({});

        // keep only records with a concrete id; narrow the type so TS knows id is number
        const updatable = selectedRecords.filter(
            (r): r is (typeof selectedRecords)[number] & { id: number } =>
                r.id != null
        );
        type Rec = (typeof updatable)[number];

        const results = await Promise.allSettled(
            updatable.map((r) => updatePersonRecordPhase(r.id, selectedPhase))
        );

        // build error map + collect successes
        const errs: Record<number, string> = {};
        const successRecs: Rec[] = [];
        results.forEach((res, i) => {
            const rec = updatable[i];
            if (res.status === "rejected") {
                errs[rec.id] = String(res.reason);
            } else {
                successRecs.push(rec);
            }
        });

        setErrors(errs);
        setSaving(false);

        // keep only failures selected so user can retry them
        setSelectedRecords((prev) =>
            prev.filter((r) => r.id != null && errs[r.id!])
        );

        // ---- notify (only if the phase maps to a channel and we had successes)
        const route = channelForPhase(selectedPhase);
        if (route && successRecs.length > 0) {
            const names = successRecs.map(
                (r) => (r as PersonRecord).preferredName ?? `ID ${r.id}`
            );
            const messageHtml =
                `🆕 <b>${names.length}</b> moved to <b>${selectedPhase}</b>` +
                (names.length <= 5 ? `: ${names.join(", ")}` : "");

            try {
                await sendTeamsNotification({ ...route, messageHtml });
            } catch (e) {
                console.error("Teams notify failed:", e);
            }
        }

        onPhaseChangeComplete();
    };

    return (
        <>
            <div className="phase-changes">
                <div className="lable-container">
                    <label id="phase-select-label">
                        Updated Phase:
                        <select
                            id="phase-select"
                            value={selectedPhase}
                            onChange={(e) =>
                                setSelectedPhase(
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
                        No people to change—everyone is already in{" "}
                        {LifeCyclePhase[selectedPhase]}.
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
                                <p className="name">{`${getDisplayName(r)}`}</p>
                                <input
                                    type="text"
                                    placeholder="Additional Information"
                                    className="info"
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
