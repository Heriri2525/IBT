import { useState } from "react";

function ProjectCard({ project }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const nextImage = () => {
    if (currentImage === project.images.length - 1) {
      setCurrentImage(0);
    } else {
      setCurrentImage(currentImage + 1);
    }
  };

  const previousImage = () => {
    if (currentImage === 0) {
      setCurrentImage(project.images.length - 1);
    } else {
      setCurrentImage(currentImage - 1);
    }
  };

  const openGallery = () => {
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  return (
    <>
      <article className="project-card">

        <div className="project-card-number">
          {project.number}
        </div>

        <div className="project-card-layout">

          {/* IMAGE */}

          <div className="project-card-image">

            <img
              src={project.images[currentImage]}
              alt={`${project.title} screenshot ${currentImage + 1}`}
            />

            <div className="project-image-overlay">

              <span>
                {String(currentImage + 1).padStart(2, "0")}
                {" / "}
                {String(project.images.length).padStart(2, "0")}
              </span>

              <button onClick={openGallery}>
                View all ↗
              </button>

            </div>

          </div>

          {/* INFORMATION */}

          <div className="project-card-info">

            <p className="project-category">
              {project.category}
            </p>

            <h3>
              {project.title}
            </h3>

            <p className="project-role">
              {project.role}
            </p>

            <p className="project-description">
              {project.description}
            </p>

            <div className="project-technologies">

              {project.technologies.map((technology) => (
                <span key={technology}>
                  {technology}
                </span>
              ))}

            </div>

            <button
              className="project-explore"
              onClick={openGallery}
            >
              Explore project
              <span>→</span>
            </button>

          </div>

        </div>

      </article>

      {/* GALLERY */}

      {galleryOpen && (
        <div
          className="gallery-overlay"
          onClick={closeGallery}
        >

          <div
            className="gallery"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="gallery-top">

              <div>

                <p className="small-label">
                  {project.category}
                </p>

                <h2>
                  {project.title}
                </h2>

              </div>

              <button
                className="gallery-close"
                onClick={closeGallery}
              >
                CLOSE ×
              </button>

            </div>

            <div className="gallery-main">

              <button
                className="gallery-arrow gallery-prev"
                onClick={previousImage}
              >
                ←
              </button>

              <img
                src={project.images[currentImage]}
                alt={`${project.title} screenshot ${currentImage + 1}`}
              />

              <button
                className="gallery-arrow gallery-next"
                onClick={nextImage}
              >
                →
              </button>

            </div>

            <div className="gallery-bottom">

              <p>
                {String(currentImage + 1).padStart(2, "0")}
                {" / "}
                {String(project.images.length).padStart(2, "0")}
              </p>

              <div className="gallery-thumbnails">

                {project.images.map((image, index) => (
                  <button
                    key={image}
                    className={
                      currentImage === index
                        ? "thumbnail thumbnail-active"
                        : "thumbnail"
                    }
                    onClick={() => setCurrentImage(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </button>
                ))}

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default ProjectCard;
