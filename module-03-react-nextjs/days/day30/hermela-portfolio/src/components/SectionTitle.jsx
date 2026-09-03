function SectionTitle({ number, title, highlight }) {
  return (
    <div className="section-title">

      <p className="small-label">
        {number} — {title}
      </p>

      <h2>
        {highlight}
      </h2>

    </div>
  );
}

export default SectionTitle;
