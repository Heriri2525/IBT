import ProjectCard from "./ProjectCard";
import projects from "../data/project";

function Projects() {
  return (
    <section id="projects" className="projects-section">

      <div className="page-container">

        <div className="projects-intro">

          <p className="small-label">
            03 / SELECTED WORK
          </p>

          <h2>
            Things I've
            <br />
            <em>built.</em>
          </h2>

          <p className="projects-intro-text">
            A selection of projects I've worked on
            while learning, building and improving
            my software development skills.
          </p>

        </div>

        <div className="projects-list">

          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default Projects;
