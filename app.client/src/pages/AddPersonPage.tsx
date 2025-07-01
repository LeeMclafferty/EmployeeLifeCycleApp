import type React from "react";

const AddPersonPage = () => {

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('http://localhost:7034/api/PersonRecord/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(collectFormData(e.currentTarget))
        })
    }

    const collectFormData = (form: HTMLFormElement) => {
        const personRecord = {
            firstName: (form.elements.namedItem("FirstName") as HTMLInputElement)?.value,
            middleName: (form.elements.namedItem("MiddleName") as HTMLInputElement)?.value,
            lastName: (form.elements.namedItem("LastName") as HTMLInputElement)?.value,
            preferredName: (form.elements.namedItem("PreferredName") as HTMLInputElement)?.value,
            Intials: (form.elements.namedItem("Intials") as HTMLInputElement)?.value,
            startDate: (form.elements.namedItem("StartDate") as HTMLInputElement)?.value,
            phoneNumber: (form.elements.namedItem("PhoneNumber") as HTMLInputElement)?.value,
            deskNumber: (form.elements.namedItem("DeskNumber") as HTMLInputElement)?.value,
            emailAddress: (form.elements.namedItem("EmailAddress") as HTMLInputElement)?.value,
            isFullyRemote: (form.elements.namedItem("FullyRemote") as HTMLInputElement)?.checked,
            jobTitle: (form.elements.namedItem("JobTitle") as HTMLInputElement)?.value,
            jobLevel: (form.elements.namedItem("JobLevel") as HTMLInputElement)?.value,
            department: (form.elements.namedItem("Department") as HTMLInputElement)?.value
        };

        return personRecord;
    }

    return (
      <>
      <h2>Add Person Page</h2>
            <form onSubmit={handleSubmit}>
        <label>
            First Name:
            <input type="text" name="FirstName" />
        </label>
        <label>
            Middle Name:
            <input type="text" name="MiddleName" />
        </label>
        <label>
            Last Name:
            <input type="text" name="LastName" />
        </label>
        <label>
            Preferred Name:
            <input type="text" name="PreferredName" />
        </label>
        <label>
            initials:
            <input type="text" name="initials" />
        </label>
        <label>
            Start Date:
            <input type="date" name="StartDate" />
        </label>
        <label>
            Email:
            <input type="email" name="EmailAddress" />
        </label>
        <label>
            Phone Number:
            <input type="text" name="PhoneNumber" />
        </label>
        <label>
            Desk Number:
            <input type="number" name="DeskNumber" />
        </label>
        <label>
            Fully Remote:
            <input type="checkbox" name="FullyRemote" />
        </label>
        <label>
            Job Title:
            <input type="text" name="JobTitle" />
        </label>
        <label>
            Job Level:
            <input type="text" name="JobLevel" />
        </label>
        <label>
            Department:
            <input type="text" name="Department" />
        </label>
         <input type="submit" value="submit"></input>
    </form>
      </>
  );
}

export default AddPersonPage;