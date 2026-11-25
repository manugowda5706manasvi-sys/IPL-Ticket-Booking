import heroImage from '../assets/hero.png'

export function Hero() {
  return (
    <section className="hero-section" id="home">
      <img className="hero-image" src={heroImage} alt="Cricket stadium ready for match day" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow">THE CROWD. THE ROAR. THE GAME.</p>
        <h1>Every match<br />has a moment.</h1>
        <p className="hero-description">
          Be there when it happens. Find your match and book your place in the stands.
        </p>
        <a className="primary-button" href="#matches">Explore matches <span aria-hidden="true">→</span></a>
        <div className="hero-stats" aria-label="Booking highlights">
          <div><strong>06</strong><span>upcoming games</span></div>
          <div><strong>10</strong><span>teams in the action</span></div>
          <div><strong>1</strong><span>unforgettable season</span></div>
        </div>
      </div>
      <span className="hero-side-label" aria-hidden="true">INDIAN PREMIER LEAGUE · 2026</span>
    </section>
  )
}