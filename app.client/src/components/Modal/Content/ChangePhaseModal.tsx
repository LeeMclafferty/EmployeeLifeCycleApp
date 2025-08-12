import { useEffect, useMemo, useState } from "react";
import {
    LifeCyclePhase,
    type PersonRecord,
} from "../../../types/PersonRecordType";
import { getDisplayName } from "../../../helpers/formattingHelpers";
import "./ChangePhaseModal.css";
import { updatePersonRecordPhase } from "../../../api/PersonRecordApi";

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

    const onSubmitClick = async () => {
        setSaving(true);
        setErrors({});

        const results = await Promise.allSettled(
            selectedRecords
                .filter((r) => r.id != null)
                .map((r) => updatePersonRecordPhase(r.id!, selectedPhase))
        );

        const errs: Record<number, string> = {};
        results.forEach((res, i) => {
            const id = selectedRecords.filter((r) => r.id != null)[i].id!;
            if (res.status === "rejected") errs[id] = String(res.reason);
        });

        setErrors(errs);
        setSaving(false);
        setSelectedRecords((prev) =>
            prev.filter((r) => r.id != null && errs[r.id!])
        );

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
