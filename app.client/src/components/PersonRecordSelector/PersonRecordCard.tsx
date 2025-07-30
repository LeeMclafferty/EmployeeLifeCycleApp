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
                    <div id="display-name">{getDisplayName(person)}</div>
                    {isActive ? (
                        <div className="record-info">
                            Initials: {person.initials}
                        </div>
                    ) : null}
                    <div className="record-info">
                        Start date: {formatDate(person.startDate || "")}
                    </div>
                    <div className="record-info">
                        Department: {person.department?.displayName}
                    </div>
                    {isActive ? (
                        <div className="record-info">
                            Job Title: {person.jobTitle}
                        </div>
                    ) : null}
                    {isActive ? (
                        <div className="record-info">
                            Desk: {person.deskNumber}
                        </div>
                    ) : null}
                    {/*Want to come back and make this a nested check to display "remote" if is remote.*/}
                    {isActive ? (
                        <div className="record-info">
                            Ext: {person.phoneNumber}
                        </div>
                    ) : null}
                    {/*Later want to be able to display a "Team" if applicable*/}
                </div>
            </div>
        </>
    );
};

export default PersonRecordCard;
