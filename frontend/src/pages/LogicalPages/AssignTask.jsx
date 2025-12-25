import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASK, GET_USERS, ASSIGN_TASK } from "../../graphql/LogicalQueries";
import { AuthContext } from "../../context/AuthContext";

const AssignTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [selectedUserId, setSelectedUserId] = useState("");

  const {
    loading: taskLoading,
    error: taskError,
    data: taskData,
  } = useQuery(GET_TASK, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_USERS);

  const [assignTask, { loading: assigning, error: assignError }] =
    useMutation(ASSIGN_TASK);

  useEffect(() => {
    if (taskData?.task?.assignedTo) {
      setSelectedUserId(taskData.task.assignedTo.id);
    }
  }, [taskData]);

  const handleAssign = async () => {
    if (!selectedUserId) return;

    try {
      await assignTask({
        variables: {
          taskId: id,
          userId: selectedUserId,
        },
      });

      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error("Assign task failed:", err);
    }
  };

  if (taskLoading || usersLoading) {
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading…
      </p>
    );
  }

  if (taskError) {
    return (
      <p className="text-center text-red-500 mt-20">
        {taskError.message}
      </p>
    );
  }

  if (usersError) {
    return (
      <p className="text-center text-red-500 mt-20">
        {usersError.message}
      </p>
    );
  }

  const task = taskData.task;

  const regularUsers = usersData.users.filter(
    (u) => u.role?.toLowerCase() === "user"
  );

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-emerald-600">
          Assign Task
        </h1>
        <p className="text-emerald-600/70 mt-1">
          Assign this task to a user
        </p>
      </div>

      <div className="bg-green-50/70 rounded-2xl p-6 shadow-lg border border-green-100 space-y-4">
        <div>
          <p className="text-sm text-emerald-700">
            <strong>Task:</strong> {task.title}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-1">
            Select User
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full border border-emerald-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">-- Select a user --</option>
            {regularUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName || u.username} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {assignError && (
          <div className="text-sm text-red-700 bg-red-100/60 rounded-xl px-4 py-2 text-center">
            {assignError.message}
          </div>
        )}

        <button
          onClick={handleAssign}
          disabled={assigning || !selectedUserId}
          className="w-full px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm hover:bg-emerald-600 transition disabled:opacity-50"
        >
          {assigning ? "Assigning…" : "Assign Task"}
        </button>
      </div>
    </div>
  );
};

export default AssignTask;
