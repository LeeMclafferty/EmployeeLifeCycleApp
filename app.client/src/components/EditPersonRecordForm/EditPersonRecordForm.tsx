
import { updatePersonRecord } from "../../api/personRecordApi";
import type { PersonRecord } from "../../types/PersonRecord";

type Props = {
    person: PersonRecord ;
};

const EditPersonRecordForm = ({ person }: Props) => {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = document.getElementById("EditPersonForm") as HTMLFormElement;
        const formData: PersonRecord = collectFormData(form);
        await updatePersonRecord(formData)
            .catch(err => {
                console.log("Error while saving edits:", err);
            });
    }

    const collectFormData = (form: HTMLFormElement) => {
        const deskRaw: string = (form.elements.namedItem("DeskNumber") as HTMLInputElement)?.value;

        const formPerson: PersonRecord = {
            id: person.id,
            firstName: (form.elements.namedItem("FirstName") as HTMLInputElement)?.value,
            middleName: (form.elements.namedItem("MiddleName") as HTMLInputElement)?.value,
            lastName: (form.elements.namedItem("LastName") as HTMLInputElement)?.value,
            preferredName: (form.elements.namedItem("PreferredName") as HTMLInputElement)?.value,
            initials: (form.elements.namedItem("Initials") as HTMLInputElement)?.value,
            startDate: (form.elements.namedItem("StartDate") as HTMLInputElement)?.value,
            endDate: null,
            phoneNumber: (form.elements.namedItem("PhoneNumber") as HTMLInputElement)?.value,
            deskNumber: deskRaw === "" ? null : Number(deskRaw),
            emailAddress: (form.elements.namedItem("EmailAddress") as HTMLInputElement)?.value,
            isFullyRemote: (form.elements.namedItem("FullyRemote") as HTMLInputElement)?.checked,
            jobTitle: (form.elements.namedItem("JobTitle") as HTMLInputElement)?.value,
            jobLevel: (form.elements.namedItem("JobLevel") as HTMLInputElement)?.value,
            department: (form.elements.namedItem("Department") as HTMLInputElement)?.value
        };

        return formPerson;
    }

    //console.log(person);
    return (
        <form id="EditPersonForm" onSubmit={ handleSubmit }>
            <label>
                First Name:
                <input type="text" name="FirstName" defaultValue={ person.firstName || ""} />
            </label>
            <label>
                Middle Name:
                <input type="text" name="MiddleName" defaultValue={person.middleName || ""} />
            </label>
            <label>
                Last Name:
                <input type="text" name="LastName" defaultValue={person.lastName || ""} />
            </label>
            <label>
                Preferred Name:
                <input type="text" name="PreferredName" defaultValue={person.preferredName || ""} />
            </label>
            <label>
                initials:
                <input type="text" name="Initials" defaultValue={person.initials|| ""} />
            </label>
            <label>
                Start Date:
                <input type="date" name="StartDate" defaultValue={
                    person.startDate
                        ? person.startDate.split("T")[0] // or manually slice or regex if needed
                        : ""
                } />
            </label>
            <label>
                Email:
                <input type="email" name="EmailAddress" defaultValue={person.emailAddress || ""} />
            </label>
            <label>
                Phone Number:
                <input type="text" name="PhoneNumber" defaultValue={person.phoneNumber || ""} />
            </label>
            <label>
                Desk Number:
                <input type="number" name="DeskNumber" defaultValue={person.deskNumber || ""} />
            </label>
            <label>
                Fully Remote:
                <input type="checkbox" name="FullyRemote" defaultChecked={person.isFullyRemote} />
            </label>
            <label>
                Job Title:
                <input type="text" name="JobTitle" defaultValue={person.jobTitle || ""} />
            </label>
            <label>
                Job Level:
                <input type="text" name="JobLevel" defaultValue={person.jobLevel || ""} />
            </label>
            <label>
                Department:
                <input type="text" name="Department" defaultValue={person.department || ""} />
            </label>
            <input type="submit" defaultValue="submit"></input>
        </form>
    );
};


export default EditPersonRecordForm;