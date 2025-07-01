const AddPersonPage = () => {
    return (
      <>
      <h2>Add Person Page</h2>
      <form>
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
            Intials:
            <input type="text" name="Intials" />
        </label>
        <label>
            Start Date:
            <input type="date" name="StartDate" />
        </label>
        <label>
            Email:
            <input type="email" name="Email" />
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