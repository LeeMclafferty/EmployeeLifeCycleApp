import { useState } from "react";
import { type PersonRecord } from "../../../types/PersonRecordType";
import { getDisplayName } from "../../../helpers/formattingHelpers";
import "./ChangePhaseModal.css";

type Props = {
    PersonRecords: PersonRecord[];
};
const ChangePhaseModal = ({ PersonRecords }: Props) => {
    const [personRecords] = useState<PersonRecord[]>(PersonRecords);
    return (
        <>
            <div className="phase-changes">
                <div className="lable-container">
                    <label id="phase-select-label">
                        Updated Phase:
                        <select id="phase-select">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>
                    </label>
                </div>
                <div id="submit-container">
                    <button id="submit-btn">Submit Changes</button>
                </div>
            </div>
            <ul>
                {personRecords.map((r) => (
                    <li key={r.id} className="row-outter">
                        <div className="row-inner">
                            <div className="row-content">
                                <input
                                    type="checkbox"
                                    className="check-box"
                                ></input>
                                <p className="name">{getDisplayName(r)}</p>
                                <input
                                    type="text"
                                    placeholder="Additional Information"
                                    className="info"
                                ></input>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ChangePhaseModal;
