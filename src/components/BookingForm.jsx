
import { useState } from 'react'

export function BookingForm({ match, onConfirm, onCancel }) {
  const [userName, setUserName] = useState('')
  const [quantity, setQuantity] = useState(1)

  const maxTickets = Math.min(match.availableSeats, 6)

  function handleSubmit(event) {
    event.preventDefault()

    if (!userName.trim() || quantity < 1 || quantity > maxTickets) {
      return
    }

    onConfirm({
      matchId: match.id,
      quantity,
      userName: userName.trim()
    })
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="booking-form-heading">
        <div>
          <p className="eyebrow">YOUR MATCH</p>
          <h3>
            {match.team1} <span>vs</span> {match.team2}
          </h3>
        </div>

        <button
          className="cancel-button"
          type="button"
          onClick={onCancel}
          aria-label="Close booking form"
        >
          ×
        </button>
      </div>

      <p className="booking-match-meta">
        {match.date} <span>·</span> {match.venue}
      </p>

      <label htmlFor="user-name">Your name</label>
      <input
        id="user-name"
        type="text"
        value={userName}
        onChange={(event) => setUserName(event.target.value)}
        placeholder="Enter your name"
        required
      />

      <label htmlFor="ticket-quantity">Number of tickets</label>

      <div className="quantity-row">
        <input
          id="ticket-quantity"
          type="number"
          min="1"
          max={maxTickets}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          required
        />

        <span>Max. {maxTickets} per booking</span>
      </div>

      <div className="booking-total">
        <span>Total amount</span>
        <strong>
          ₹{(match.price * quantity).toLocaleString('en-IN')}
        </strong>
      </div>

      <button
        className="confirm-button"
        type="submit"
        disabled={maxTickets < 1}
      >
        Confirm booking <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
