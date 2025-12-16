import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { gql } from "@apollo/client";

const AddProject = () => {
  const { user } = useContext(AuthContext);

  const [name, setname] = useState('');
  const [description, setdescription] = useState('');
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const [status, setstatus] = useState('');

  const handleNameChange = (event) => {
    setname(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setdescription(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setstartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setendDate(event.target.value);
  };

  const handleStatusChange = (event) => {
    setstatus(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const CREATE_PROJECT = gql`
      mutation CreateProject {
        createProject {
          id
          name
          description
          startDate
          endDate
          status
        }
      }
    `;
  };

  if (!user || user.role.toLowerCase() !== "manager") {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>

        <label>
          Description:
          <input type="text" value={description} onChange={handleDescriptionChange} />
        </label>

        <label>
          Start Date:
          <input type="text" value={startDate} onChange={handleStartDateChange} />
        </label>

        <label>
          End Date:
          <input type="text" value={endDate} onChange={handleEndDateChange} />
        </label>

        <label>
          Status:
          <input type="text" value={status} onChange={handleStatusChange} />
        </label>

        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
