import React from "react";
import { useParams } from "react-router-dom";
import { DELETE_PROJECT } from "../../graphql/LogicalQueries";
import { useMutation } from "@apollo/client";

const DeleteProject = ()=>{
    const { id } = useParams();
    const [DeleteProject,{data,error,loading}]= useMutation(DELETE_PROJECT,{
        variables:{projectId:id}
    });
    return(
        
        <div>
            <button onClick={()=>DeleteProject()}>Delete Project</button>
            {loading && <p>Deleting project...</p>}
            {error && <p>Error deleting project: {error.message}</p>}
            {data && data.deleteProject && data.deleteProject.success && (
                <p>Project deleted successfully!</p>
            )}
        </div>
    )


}; export default DeleteProject;