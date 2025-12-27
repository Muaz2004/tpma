import React from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { GET_PROJECTS_BY_USER } from "../../graphql/LogicalQueries";




const MyProjects = () => {
    const { user } = useContext(AuthContext);
    const { loading, error, data } = useQuery(GET_PROJECTS_BY_USER, {
        variables: { userId: user.id },
    });

    if (loading)
        return (
            <p className="text-center text-gray-400 mt-20 animate-pulse">
                Loading your projects...
            </p>
        );

    if (error)
        return (
            <p className="text-center text-red-500 mt-20">
                Error: {error.message}
            </p>
        );


    if (!data.projectsByUser || data.projectsByUser.length === 0)
        return (
            <p className="text-center text-gray-500 mt-20">
                You have no projects assigned.
            </p>
        );


    return (        <div className="max-w-7xl mx-auto px-6 py-10 relative">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-emerald-500 mb-2 animate-fade-in">
                    My Projects
                </h1>
                <p className="text-emerald-600/80 mb-4">
                    View your projects, track progress, and manage tasks.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data.projectsByUser.map((project) => (
                    <Link
                        to={`/projects/${project.id}`}

                        key={project.id}
                        className="card-link"
                    >

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-emerald-400">
                                    {project.name}
                                </h3>
                                <span
                                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                                        project.status === "Active"
                                            ? "bg-emerald-500 text-white"
                                            : project.status === "Completed"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-400 text-white"
                                    }`}
                                >
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-emerald-600/80 mb-4 leading-relaxed">
                                {project.description}
                            </p>
                            <div className="text-sm text-emerald-400">
                                <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
                                <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

}; export default MyProjects;
    