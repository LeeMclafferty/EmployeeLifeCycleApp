import { useNavigate } from "react-router-dom";
import { getDisplayName } from "../../helpers/FormattingHelpers";
import { type PersonRecord } from "../../types/PersonRecordType";
import "./ViewPersonRecord.css";

type Props = {
    person: PersonRecord;
};
const ViewPersonRecord = ({ person }: Props) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/Person/Edit/${person.id}`);
    };

    return (
        <>
            <div className="outter">
                <div className="view-container card">
                    <div className="btn-container">
                        <button
                            className="btn btn-primary edit-btn"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">Display Name:</div>
                            <div className="read-data">
                                {getDisplayName(person)}
                            </div>
                        </div>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">First Name:</div>
                            <div className="read-data">{person.firstName}</div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">Middle Name:</div>
                            <div className="read-data">{person.middleName}</div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">Last Name:</div>
                            <div className="read-data">{person.lastName}</div>
                        </div>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">Preferred Name:</div>
                            <div className="read-data">
                                {person.preferredName}
                            </div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">Initials:</div>
                            <div className="read-data">{person.initials}</div>
                        </div>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">Start Date:</div>
                            <div className="read-data">
                                {person.startDate
                                    ? person.startDate.split("T")[0]
                                    : ""}
                            </div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">End Date:</div>
                            <div className="read-data">
                                {person.endDate
                                    ? person.endDate.split("T")[0]
                                    : ""}
                            </div>
                        </div>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">Email:</div>
                            <div className="read-data">
                                {person.emailAddress}
                            </div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">Phone Number:</div>
                            <div className="read-data">
                                {person.phoneNumber}
                            </div>
                        </div>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">Desk Number:</div>
                            <div className="read-data">{person.deskNumber}</div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">Location:</div>
                            <div className="read-data">
                                {person.isFullyRemote ? "Remote" : "In Office"}
                            </div>
                        </div>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">Job Title:</div>
                            <div className="read-data">{person.jobTitle}</div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">Job Level:</div>
                            <div className="read-data">{person.jobLevel}</div>
                        </div>
                    </div>
                    <div className="read-group">
                        <div className="read-container">
                            <div className="read-header">Department:</div>
                            <div className="read-data">
                                {person.department?.displayName}
                            </div>
                        </div>
                        <div className="read-container">
                            <div className="read-header">Team:</div>
                            <div className="read-data">{person.team?.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewPersonRecord;
