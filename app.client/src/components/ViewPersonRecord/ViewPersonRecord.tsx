import { useNavigate } from "react-router-dom";
import { getDisplayName } from "../../helpers/formattingHelpers";
import type { PersonRecord } from "../../types/PersonRecord";

type Props = {
    person: PersonRecord
}
const ViewPersonRecord = ({ person }: Props) => {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/EditPerson/${person.id}`);
    }

    return (
    <>
        <button onClick={handleEditClick}>Edit</button>
        <form id="view PersonForm">
            <div>
                <label>
                    Display Name:
                    <span> {getDisplayName(person)}</span>
                </label>
            </div>
            <div>
                <label>
                    First Name:
                    <span> {person.firstName} </span>
                </label>
            </div>
            <div>
                <label>
                    Middle Name:
                    <span> {person.middleName}</span>
                </label>
            </div>
            <div>
                <label>
                    Last Name:
                    <span> {person.lastName}</span>
                </label>
            </div>
            <div>
                <label>
                    Preferred Name:
                    <span> {person.preferredName}</span>
                </label>
            </div>
            <div>
                <label>
                    initials:
                    <span> {person.initials}</span>
                </label>
            </div>
            <div>
                <label>
                    Start Date:
                    <span> {person.startDate
                                ? person.startDate.split("T")[0]
                                : ""}
                    </span>
                </label>
            </div>
            <div>
                <label>
                    End Date:
                    <span> {person.endDate 
                                ? person.endDate.split("T")[0]
                                : ""} </span>
                </label>
            </div>
            <div>
                <label>
                    Email:
                    <span> {person.emailAddress}</span>
                </label>
            </div>
            <div>
                <label>
                    Phone Number:
                    <span> {person.phoneNumber}</span>
                </label>
            </div>
            <div>
                <label>
                    Desk Number:
                    <span> {person.deskNumber}</span>
                </label>
            </div>
            <div>
                <label>
                    Fully Remote:
                    <span> {person.isFullyRemote ? "Remote" : "In Office"}</span>
                </label>
            </div>
            <div>
                <label>
                    Job Title:
                    <span> {person.jobTitle}</span>
                </label>
            </div>
            <div>
                <label>
                    Job Level:
                    <span> {person.jobLevel}</span>
                </label>
            </div>
            <div>
                <label>
                    Department:
                    <span> {person.department}</span>
                </label>
            </div>
        </form>
    </>
    );
}

export default ViewPersonRecord;