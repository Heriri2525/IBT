function Education() {
  const education = [
    {
      number: "01",
      institution: "Addis Ababa Science and Technology University",
      shortName: "AASTU",
      degree: "BSc in Software Engineering",
      type: "University Education",
    },
    {
      number: "02",
      institution: "Bahir Dar University",
      shortName: "BDU",
      degree: "Management",
      type: "Distance Education",
    },
  ];

  return (
    <section id="education" className="education-section">
      <div className="page-container">

        <div className="education-heading">

          <p className="small-label">
            05 / EDUCATION
          </p>

          <h2>
            Where I
            <br />
            <em>learn.</em>
          </h2>

        </div>

        <div className="education-list">

          {education.map((item) => (
            <div
              className="education-item"
              key={item.number}
            >

              <div className="education-number">
                {item.number}
              </div>

              <div className="education-main">

                <p className="education-type">
                  {item.type}
                </p>

                <h3>
                  {item.institution}
                </h3>

                <p className="education-degree">
                  {item.degree}
                </p>

              </div>

              <div className="education-short">
                {item.shortName}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Education;