import SectionTitle from "./SectionTitle";

function About() {
  return (
    <section id="about" className="about-section">
      <div className="page-container">

        <SectionTitle
          number="01"
          title="ABOUT"
          highlight={
            <>
              A little
              <br />
              <em>about me.</em>
            </>
          }
        />

        <div className="about-grid">

          <div className="about-large-text">
            <p>
              I'm Hermela, a Software Engineering
              student passionate about building
              useful and engaging digital products.
            </p>
          </div>

          <div className="about-description">

            <p>
              My main focus is frontend development
              using React and JavaScript. I also work
              with Flutter to create mobile
              interfaces.
            </p>

            <p>
              I enjoy turning ideas into clean,
              responsive and user-friendly digital
              experiences while continuously
              improving my technical skills through
              practical projects.
            </p>

            <a href="#projects" className="underlined-link">
              Explore my work ↗
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}

export default About;