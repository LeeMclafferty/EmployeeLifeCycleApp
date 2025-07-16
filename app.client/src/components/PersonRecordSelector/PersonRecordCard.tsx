import placeholder from "../../assets/Placeholder500x500.png";
import "./PersonRecordSelection.css";
import { type PersonRecord } from "../../types/PersonRecordType";
import { formatDate, getDisplayName } from "../../helpers/FormattingHelpers";

type Props = {
    person: PersonRecord;
    isActive: boolean;
    onClick?: () => void;
};

const PersonRecordCard = ({ person, isActive, onClick }: Props) => {
    return (
        <>
            <div
                id="card-border"
                className={isActive ? "active" : ""}
                onClick={onClick}
            >
                <img
                    id="profile-img"
                    alt="User Image Placeholder"
                    src={placeholder}
                />
                <div id="person-info">
                    <div>{getDisplayName(person)}</div>
                    <div>Start date: {formatDate(person.startDate || "")}</div>
                    <div>Department: {person.department}</div>
                </div>
                {/* When user is selected, expand card to display more data
                - Intials
                - Job Title
                - Desk Number
                - Tax Team / CAAS Vertical
                */}
            </div>
        </>
    );
};

export default PersonRecordCard;
