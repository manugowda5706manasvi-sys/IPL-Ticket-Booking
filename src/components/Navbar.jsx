export function Navbar({ totalBookings }) {
  return (
    <nav className="navbar">
      <a className="brand" href="#home" aria-label="IPL Tickets home">
        <span className="brand-mark" aria-hidden="true">I</span>
        <span>BOUNDARY<span className="brand-accent">LINE</span></span>
      </a>
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#matches">Matches</a>
        <a href="#booking">Tickets</a>
      </div>
      <a className="nav-bookings" href="#booking">
        <span className="ticket-icon" aria-hidden="true">▰</span>
        <span>My tickets</span>
        <strong>{totalBookings}</strong>
      </a>
    </nav>
  );
}