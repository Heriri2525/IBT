function Hero() {
  return (
    <section id="home" className="hero-section">

      <div className="hero-top">

        <p>
          HERMELA MULUGETA JEMEMA
        </p>

        <p className="hero-available">
          AVAILABLE FOR OPPORTUNITIES
          <span></span>
        </p>

      </div>

      <div className="hero-content">

        <div className="hero-title">

          <p className="hero-intro">
            SOFTWARE ENGINEERING STUDENT
            <br />
            FRONTEND & MOBILE DEVELOPER
          </p>

          <h1>
            Hermela
            <br />
            <em>Mulugeta.</em>
          </h1>

          <p className="hero-description">
            I build thoughtful web and mobile
            experiences using modern technologies.
          </p>

        </div>

        <div className="hero-image-area">

          <div className="hero-image-frame">

            <img
              src="/images/profile.png"
              alt="Hermela Mulugeta"
            />

          </div>

        </div>

      </div>

      <div className="hero-bottom">

        <p>
          Based in Ethiopia · Software Engineering
        </p>

        <a href="#projects">
          EXPLORE MY WORK
          <span>↓</span>
        </a>

      </div>

    </section>
  );
}

export default Hero;
