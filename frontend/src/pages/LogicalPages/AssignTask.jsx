import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TASK, GET_USERS } from "../../graphql/LogicalQueries";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useState } from "react";
import { ASSIGN_TASK } from "../../graphql/LogicalQueries";
import { useMutation } from "@apollo/client";



const AssignTask = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [selectedUserId, setSelectedUserId] = useState(null);

    const { loading: taskLoading, error: taskError, data: taskData } = useQuery(GET_TASK, {
    variables: { id },
    fetchPolicy: "network-only",
    });
    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);

    const [assignTask, { loading: assigning, error: assignError }] = useMutation(ASSIGN_TASK, {
    refetchQueries: [{ query: GET_TASK, variables: { id } }],
    });

    const handleAssign = () => {
    if (selectedUserId) {
        assignTask({
        variables: {
            taskId: id,
            userId: selectedUserId,
        },
        });
    }
    };





    return (
    
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Assign Task</h2>
      {taskLoading || usersLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : taskError ? (
        <p className="text-red-500">Error loading task: {taskError.message}</p>
        ) : usersError ? (
        <p className="text-red-500">Error loading users: {usersError.message}</p>
        ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select User:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(e.target.value)}
            >
                <option value="" disabled>
                    -- Select a user --
                </option>
                {usersData.users.map((u) => (
                    <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                    </option>
                ))}
            </select>
          </div>
          
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAssign}
                disabled={assigning || !selectedUserId}
            >
                {assigning ? "Assigning..." : "Assign Task"}
            </button>
            {assignError && (
                <p className="text-red-500 mt-2">Error assigning task: {assignError.message}</p>

            )}
        </>
      )}
    </div>
    


  );
} ; export default AssignTask; 