import { useNavigate } from "react-router";
import { useAxiosPrivate } from "../../utils/useAxiosPrivate";
import { ProjectCard } from "./ProjectCard";

import styles from './Projects.module.css';

const CreateNewProjectContainer = ({ openProjectDialog }) => {
  return (
    <div
      className={styles.create_new_project}
      title="create new project"
      onClick={openProjectDialog}
    >
      <ion-icon name="add-outline"></ion-icon>
    </div>
  );
}

export const Projects = ({ projects, setProjects, openProjectDialog }) => {
  const axiosPrivateInstance = useAxiosPrivate();
  const navigate = useNavigate();

  const deleteProject = async (projectId) => {
    await axiosPrivateInstance.delete(
      `/api/v1/projects/${projectId}`
    )
      .then((response) => {
        if(response.status === 202) {
          setProjects((prev) => {
            const newValue = prev.filter((project) => project.id !== projectId);

            return newValue;
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const openProject = async (projectId) => {
    navigate(`${projectId}/playground`);
  }

  return [
    ...projects.map((project) => {
      return <ProjectCard
        name={project.name}
        language={project.language}
        createdAt={project.created_at.split('T')[0]}
        modifiedAt={project.modified_at.split('T')[0]}
        key={project.id}
        id={project.id}
        openProject={openProject}
        deleteProject={deleteProject}
      />
    }),
    <CreateNewProjectContainer
      openProjectDialog={openProjectDialog}
      key={crypto.randomUUID}
    />
  ];
}