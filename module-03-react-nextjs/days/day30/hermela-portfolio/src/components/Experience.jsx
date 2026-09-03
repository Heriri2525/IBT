import SectionTitle from "./SectionTitle";

const experience = [
  {
    number: "01",
    title: "Frontend Developer",
    company: "UniBazzar",
    description:
      "Contributed to the frontend development of a React-based marketplace project.",
  },
  {
    number: "02",
    title: "Flutter Developer",
    company: "FarmLink",
    description:
      "Worked on the user interface and multiple screens of a Flutter mobile application.",
  },
  {
    number: "03",
    title: "Frontend Development Intern",
    company: "Mesob",
    description:
      "Gained practical experience working in a professional software development environment.",
  },
  {
    number: "04",
    title: "Software Development Trainee",
    company: "INSA",
    description:
      "Completed practical training covering frontend and backend development concepts.",
  },
];

function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="page-container">

        <SectionTitle
          number="04"
          title="EXPERIENCE"
          highlight={
            <>
              Experience
              <br />
              <em>& growth.</em>
            </>
          }
        />

        <div className="experience-list">

          {experience.map((item) => (
            <div
              className="experience-item"
              key={item.number}
            >

              <span className="experience-number">
                {item.number}
              </span>

              <div className="experience-main">

                <h3>
                  {item.title}
                </h3>

                <p className="experience-company">
                  {item.company}
                </p>

                <p className="experience-description">
                  {item.description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Experience;

