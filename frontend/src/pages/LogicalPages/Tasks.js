import React, { useState, useContext } from "react"; 
import { useQuery } from "@apollo/client";
import { ClipboardList, Calendar, Users, Plus, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GET_TASKS } from "../../graphql/LogicalQueries";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 6;

const Tasks = () => {
  const { loading, error, data } = useQuery(GET_TASKS, {
    fetchPolicy: "network-only",
  });
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // react-paginate is 0-indexed

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading tasks...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        Error: {error.message}
      </p>
    );

  if (!data?.allTasks || data.allTasks.length === 0)
    return (
      <p className="text-center text-gray-500 mt-20">
        No tasks found.
      </p>
    );

  const filteredTasks = data.allTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const displayTasks = filteredTasks.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">

      {/* 🔍 Modern Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0); // reset page when searching
            }}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/30 text-emerald-300 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition hover:text-emerald-200 hover:placeholder-emerald-200"
          />
        </div>
      </div>

      {/* Intro message */}
      <p className="text-center text-emerald-600 font-medium mb-8 text-lg md:text-xl">
        Here are all your tasks — track progress and stay on top of your work.
      </p>

      {user?.role.toLowerCase() === "manager" && (
        <Link to="/tasks/add">
          <button
            className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-4 rounded-full shadow-lg hover:bg-emerald-600 transition-transform hover:scale-110 flex items-center gap-2"
          >
            <Plus size={24} />
            Add Task
          </button>
        </Link>
      )}

      {/* Tasks Grid */}
      <div className="tasks-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {displayTasks.map((task) => {
          const statusColor =
            task.status === "Done"
              ? "bg-emerald-500"
              : task.status === "InProgress"
              ? "bg-amber-400"
              : "bg-gray-400";

          return (
            <Link to={`/tasks/${task.id}`} key={task.id} className="card-link">
              <div className="task-card border p-4 rounded-xl shadow-md bg-white hover:scale-105 transition-transform duration-300">

                <h2 className="font-semibold text-lg text-emerald-600 mb-1 truncate">
                  {task.title}
                </h2>

                <p className="text-emerald-600/80 text-sm mb-3 truncate">
                  {task.description}
                </p>

                <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-1 truncate">
                  <ClipboardList className="w-4 h-4" />
                  <span className="font-medium">Project:</span> {task.project.name}
                </p>

                <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-1 truncate">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Assigned to:</span>{" "}
                  {task.assignedTo?.firstName || "Unassigned"}
                </p>

                <p className="flex items-center gap-2 text-emerald-600/70 text-sm mb-2 truncate">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Due:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>

                <p className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${statusColor}`}
                  >
                    {task.status}
                  </span>
                </p>

              </div>
            </Link>
          );
        })}
      </div>

      {filteredTasks.length === 0 && searchTerm && (
        <p className="text-center text-gray-400 mt-6">
          No tasks match your search.
        </p>
      )}

      {/* React Paginate */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-10">
          <ReactPaginate
  previousLabel={"Prev"}
  nextLabel={"Next"}
  breakLabel={"..."}
  pageCount={pageCount}
  marginPagesDisplayed={1}
  pageRangeDisplayed={2}
  onPageChange={(selectedItem) => setCurrentPage(selectedItem.selected)}
  containerClassName="flex gap-2 flex-wrap justify-center mt-10"
  pageClassName="rounded-full"
  pageLinkClassName="px-3 py-1 text-emerald-300 bg-white/10 hover:bg-emerald-500/20 transition rounded-full"
  activeClassName="bg-emerald-500"
  activeLinkClassName="text-white"
  previousClassName="rounded-full"
  previousLinkClassName="px-3 py-1 text-emerald-300 bg-white/10 hover:bg-emerald-500/20 transition rounded-full"
  nextClassName="rounded-full"
  nextLinkClassName="px-3 py-1 text-emerald-300 bg-white/10 hover:bg-emerald-500/20 transition rounded-full"
  breakClassName="px-3 py-1 text-emerald-300"
/>

        </div>
      )}
    </div>
  );
};

export default Tasks;
