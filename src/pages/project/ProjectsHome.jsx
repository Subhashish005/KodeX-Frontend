import { useEffect, useRef, useState } from "react";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Projects } from "./Projects";
import { useAxiosPrivate } from "../../utils/useAxiosPrivate";
import { customErrorPopup, customSuccessPopup } from '../../utils/customPopup.js';

import styles from "./ProjectsHome.module.css";
import { useAuth } from "../../utils/useAuth.js";

export const ProjectsHome = () => {
  const axiosPrivateInstance = useAxiosPrivate();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    projectName: '',
    projectLang: ''
  });
  const projectOverlayRef = useRef();
  const projectNameInputRef = useRef();
  const { auth } = useAuth();

  useEffect(() => {
    fetchAllProjects();
  }, []);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const fetchAllProjects = async () => {
    await axiosPrivateInstance.get(
      '/api/v1/projects'
    )
    .then((response) => {
      if(response.status === 200) {
        setProjects(response.data);
      }
    })
    .catch(error => console.error(error));
  }

  const openProjectDialog = () => {
    if (projectOverlayRef.current && projectNameInputRef.current) {
      projectOverlayRef.current.setAttribute('style', 'display: flex');
      document.body.style.overflow = 'hidden';
      projectNameInputRef.current.focus();
    }
  }

  const closeProjectDialog = () => {
    if (projectOverlayRef.current) {
      document.body.style.overflow = '';
      projectOverlayRef.current.removeAttribute('style');
    }
  }


  const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
  };

  const validateProjectInput = () => {
    const projectName = formData.projectName.trim();
    const projectLang = formData.projectLang.trim();

    if (isBlank(projectName)) {
      customErrorPopup("Project name can't be Empty!", 1000);

      return false;
    }

    if (isBlank(projectLang)) {
      customErrorPopup("Please select a language for project!", 1000);

      return false;
    }

    return true;
  }

  // TODO: fix - hitting the submit button multiple times can create multiple
  // multiple project with same name
  const handleProjectSubmit = async (event) => {
    event.preventDefault();

    if (!validateProjectInput()) return;

    await axiosPrivateInstance.post(
      '/api/v1/projects',
      {
        project_name: formData.projectName,
        project_language: formData.projectLang,
        user_id: auth.userId
      }
    )
    .then(response => {
      if(response.status === 200) {
        setProjects((prev) => {
          return [response.data, ...prev];
        });
      }

      customSuccessPopup("Project created successfully!", 1200);
    })
    .catch(error => {
      customErrorPopup("Something went wrong while creating project");
      console.error(error);
    })
    .finally(() => {
      setFormData({
        projectName: '',
        projectLang: ''
      });

      closeProjectDialog();
    });
  }

  return (
    <>
      <div
        className={styles.project_home_root}
      >
        <Header />

        <div
          className={styles.main_container}
        >
          <div
            className={styles.project_view_root}
          >
            <div
              className={styles.project_view}
            >
              <div
                className={styles.project_header}
              >
                <h2>Your Projects</h2>

                <div
                  className={styles.btn_grp}
                >
                  <button
                    className={styles.create_btn}
                    title="create new project"
                    onClick={openProjectDialog}
                  >
                    <span className={styles.create_btn_text}>create</span>
                    <span className={styles.create_btn_icon}>
                      <ion-icon name="add-circle-outline"></ion-icon>
                    </span>
                  </button>
                </div>
              </div>

              <div className={styles.project_grid_container}>
                <div className={styles.project_grid}>
                  <Projects
                    projects={projects}
                    setProjects={setProjects}
                    openProjectDialog={openProjectDialog}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <div
        className={styles.project_overlay}
        ref={projectOverlayRef}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeProjectDialog();
        }}
      >
        <form
          onSubmit={handleProjectSubmit}
          className={styles.project_form}
        >
          <div className={styles.project_form_header}>
            <div className={styles.create_text}>
              Create a new Project
            </div>

          </div>

          <button
            className={styles.close_btn}
            onClick={(event) => {
              event.preventDefault();

              closeProjectDialog();
            }}
          >
            <ion-icon name="add-sharp"></ion-icon>
          </button>
          <div className={styles.input_grp_container}>
            <div className={styles.project_name_grp}>
              <label
                htmlFor="project_name"
              >
                Project Name
              </label>
              <input
                type="text"
                id="project_name"
                name="projectName"
                placeholder="Project name"
                value={formData.projectName}
                onChange={handleChange}
                maxLength={192}
                // tried autofocus, didn't worked for some reason
                ref={projectNameInputRef}
                required
              />
            </div>

            {/*
              this should be dyanmically generated as well
              but its fine for now
            */}
            <div className={styles.project_lang_grp}>
              <label
                htmlFor="project_lang"
              >
                Project Langauge
              </label>
              <select
                id="project_lang"
                name="projectLang"
                onChange={handleChange}
                value={formData.projectLang}
              >
                <option value="">Select a language</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </select>
            </div>
          </div>

          <button type="submit" className={styles.submit_btn}>
            submit
          </button>
        </form>
      </div>
    </>
  );

}