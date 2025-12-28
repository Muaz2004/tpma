import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Folder, ClipboardList, Plus, Search } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { GET_PROJECTS } from "../../graphql/LogicalQueries";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 6;

const Projects = () => {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_PROJECTS, {
    fetchPolicy: "network-only",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // react-paginate is 0-indexed

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 animate-pulse">
        Loading projects...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-20">
        Error: {error.message}
      </p>
    );

  if (!data?.allProjects || data.allProjects.length === 0)
    return (
      <p className="text-center text-gray-400 mt-20">
        No projects found
      </p>
    );

  const filteredProjects = data.allProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  const pageCount = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);

  const displayProjects = sortedProjects.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative">

      {/* 🔍 Modern Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0); // reset page on search
            }}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/30 text-emerald-200 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition hover:text-emerald-200 hover:placeholder-emerald-200"
          />
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-500 mb-2">
          All Projects Overview
        </h1>
        <p className="text-emerald-600/80 mb-4">
          Explore your projects, track status, and manage tasks efficiently.
        </p>
      </div>

      {/* Create Project Button */}
      {user?.role.toLowerCase() === "manager" && (
        <Link to="/projects/add">
          <button
            className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-4 rounded-full shadow-lg hover:bg-emerald-600 transition-transform hover:scale-110 flex items-center gap-2"
          >
            <Plus size={24} />
            Add Project
          </button>
        </Link>
      )}

      {/* Projects Grid */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayProjects.map((project) => (
          <Link
            to={`/projects/${project.id}`}
            key={project.id}
            className="card-link"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  {project.name}
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    project.status === "Completed"
                      ? "bg-green-600 text-white"
                      : project.status === "In Progress"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <p className="text-emerald-600/80 mb-4">
                {project.description || "No description provided"}
              </p>

              <div className="flex items-center gap-3 text-emerald-600/70">
                <ClipboardList className="w-4 h-4" />
                <span className="text-sm">
                  {project.tasks.length} Task
                  {project.tasks.length !== 1 && "s"}
                </span>
              </div>

            </div>
          </Link>
        ))}
      </div>

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

export default Projects;
