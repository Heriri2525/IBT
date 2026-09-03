function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="page-container">

        <p className="small-label">
          06 — CONTACT
        </p>

        <div className="contact-content">

          <h2>
            Let's make
            <br />
            something
            <br />
            <em>meaningful.</em>
          </h2>

          <div className="contact-right">

            <p>
              I'm open to internships,
              collaborations and interesting
              software development opportunities.
            </p>

            <a
              href="mailto:mhermela87@gmail.com"
              className="contact-email"
            >
              mhermela87@gmail.com
              <span>↗</span>
            </a>

            <div className="contact-socials">

              <a
                href="https://github.com/Heriri2525"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>

              <a
                href="/cv.pdf"
                target="_blank"
                rel="noreferrer"
              >
                CV ↗
              </a>

            </div>

          </div>
        </div>

        <div className="contact-footer">

          <div>
            ADDIS ABABA, ETHIOPIA
          </div>

          <div>
            +251 901 209 318
          </div>

          <div>
            mhermela87@gmail.com
          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;