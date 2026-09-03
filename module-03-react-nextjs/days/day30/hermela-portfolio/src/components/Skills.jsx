function Skills() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Flutter",
    "Supabase",
    "Git & GitHub",
    "MySQL",
  ];

  return (
    <section id="skills" className="skills-section">

      <div className="page-container">

        <div className="skills-heading">

          <p className="small-label">
            02 / SKILLS
          </p>

          <h2>
            What I
            <br />
            <em>work with.</em>
          </h2>

        </div>

        <div className="skills-grid">

          {skills.map((skill, index) => (
            <div
              className="skill-card"
              key={skill}
            >

              <span>
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>
                {skill}
              </h3>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Skills;
