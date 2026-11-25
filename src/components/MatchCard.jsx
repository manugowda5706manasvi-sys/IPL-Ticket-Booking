export function MatchCard({ match, onSelectMatch, isSelected }) {
  const isSoldOut = match.availableSeats === 0

  return (
    <article className={`match-card${isSelected ? ' match-card-selected' : ''}`}>
      <div className="match-card-topline">
        <span className="match-tag">LEAGUE MATCH</span>
        <span className={`availability${isSoldOut ? ' sold-out' : ''}`}>
          {isSoldOut ? 'Sold out' : `${match.availableSeats} seats left`}
        </span>
      </div>
      <div className="teams">
        <div className="team">
          <span className={`team-badge team-${match.team1.toLowerCase()}`}>{match.team1.slice(0, 1)}</span>
          <strong>{match.team1}</strong>
        </div>
        <span className="versus">VS</span>
        <div className="team">
          <span className={`team-badge team-${match.team2.toLowerCase()}`}>{match.team2.slice(0, 1)}</span>
          <strong>{match.team2}</strong>
        </div>
      </div>
      <div className="match-details">
        <p><span aria-hidden="true">◷</span>{match.date}</p>
        <p><span aria-hidden="true">⌖</span>{match.venue}</p>
      </div>
      <div className="match-card-bottom">
        <p className="match-price"><span>Starting at</span><strong>₹{match.price.toLocaleString('en-IN')}</strong></p>
        <button
          className="select-match-button"
          type="button"
          disabled={isSoldOut}
          aria-pressed={isSelected}
          onClick={() => onSelectMatch(match)}
        >
          {isSoldOut ? 'Sold out' : isSelected ? 'Selected' : 'Book now'}
          {!isSoldOut && <span aria-hidden="true">→</span>}
        </button>
      </div>
    </article>
  )
}