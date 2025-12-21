import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery} from "@apollo/client";
import { Folder, ClipboardList, Calendar } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GET_PROJECT } from "../../graphql/LogicalQueries";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT } from "../../graphql/LogicalQueries";



const ProjectDetails = () => {
  const { id } = useParams();
  const navigate=useNavigate()
  const {user} =useContext(AuthContext)
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
    fetchPolicy: "network-only",
  });
 
  // Delete project mutation
  const [deleteProject, { deleteLoading, deleteError }] = useMutation(DELETE_PROJECT);

  const handleDelete = async () => {
    await deleteProject({
  variables: { projectId: id }
});

navigate("/projects", {
  state: { deleteSuccess: "Project deleted successfully" }
});

};

   if (deleteLoading) return <p>Loading project...</p>;
if (deleteError) return <p>Error loading project.</p>;


  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading project...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        Error: {error.message}
      </p>
    );

  const project = data?.project;

  if (!project)
    return (
      <p className="text-center text-gray-400 mt-20">
        Project not found
      </p>
    );

    return (
  <div className="max-w-3xl mx-auto px-6 py-10">
    
    {/* Page Intro */}
<div className="mb-8 text-center animate-fade-slide">
  <h1 className="text-3xl font-semibold text-emerald-600 mb-2">
    Project Details
  </h1>
  <p className="text-emerald-600/70 max-w-xl mx-auto">
    View detailed information about this project, including its timeline,
    current status, and all related tasks in one place.
  </p>
</div>


    {/* Card wrapper */}
    <div className="bg-green-50/70 backdrop-blur rounded-2xl p-8 shadow-lg border border-green-100">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-emerald-600 flex items-center gap-2">
            <Folder className="w-5 h-5" />
            {project.name}
          </h2>
          <p className="text-emerald-600/70 mt-1 text-sm">
            Project overview & task summary
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
            project.status === "Completed"
              ? "bg-green-500 text-white"
              : project.status === "In Progress"
              ? "bg-yellow-500 text-white"
              : "bg-gray-400 text-white"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-emerald-700/80 mb-6 leading-relaxed">
        {project.description}
      </p>

      {/* Dates */}
      <div className="flex items-center gap-3 text-sm text-emerald-600/70 mb-8">
        <Calendar className="w-4 h-4" />
        <span>
          {project.startDate} → {project.endDate}
        </span>
      </div>

      {/* Tasks */}
      <div className="border-t border-emerald-200 pt-6">
        <div className="flex items-center gap-2 mb-4 text-emerald-600">
          <ClipboardList className="w-4 h-4" />
          <h3 className="font-medium">
            Tasks ({project.tasks.length})
          </h3>
        </div>

        {project.tasks.length === 0 ? (
          <p className="text-sm text-emerald-600/60">
            No tasks for this project
          </p>
        ) : (
          <ul className="space-y-3">
            {project.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-white/70 px-4 py-3 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition"
              >
                <span className="text-sm text-emerald-800 font-medium">
                  {task.title}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
      {/* Action Buttons */}
   {user.role.toLowerCase() === "manager" && (
  <div>
    <button onClick={() => navigate(`/projects/${id}/edit`)}>
      Edit Project
    </button>
  </div>
)}

  <div>
  {user.role.toLowerCase() === "manager" && (
    <button onClick={handleDelete}>
      Delete Project
    </button>
  )}
</div>


  </div>
);


};

export default ProjectDetails;
