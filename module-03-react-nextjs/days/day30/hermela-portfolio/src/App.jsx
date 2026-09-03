import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import ProjectCard from "./components/ProjectCard";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";

import projects from "./data/projects";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>

      {/* NAVIGATION */}

      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />


      {/* HOME */}

      <Hero />


      {/* ABOUT */}

      <About />


      {/* SKILLS */}

      <Skills />


      {/* SELECTED WORK */}

      <section
        id="projects"
        className="projects-section"
      >

        <div className="page-container">

          <div className="projects-intro">

            <p className="small-label">
              03 / SELECTED WORK
            </p>

            <h2>
              Selected
              <br />
              <em>work.</em>
            </h2>

            <p className="projects-intro-text">
              A selection of projects I have worked
              on across web and mobile development.
              Each project represents practical
              experience in turning ideas into
              working digital experiences.
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


      {/* EXPERIENCE */}

      <Experience />


      {/* EDUCATION */}

      <Education />


      {/* CONTACT */}

      <Contact />


      {/* FOOTER */}

      <footer className="footer">

        <p>
          © 2026 Hermela Mulugeta
        </p>

        <a href="#home">
          BACK TO TOP ↑
        </a>

      </footer>

    </div>
  );
}

export default App;
