
import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { Navbar } from './components/Navbar.jsx'
import { MatchCard } from './components/MatchCard.jsx'
import { BookingForm } from './components/BookingForm.jsx'
import { Hero } from './components/Hero.jsx'
import { Footer } from './components/Footer.jsx'
import './App.css'

export default function App() {
  const [matches, setMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [totalBookings, setTotalBookings] = useState(0)
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch matches from Supabase when the page loads

useEffect(() => {
  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching matches:', error.message)
      setError('Unable to load matches.')
      setLoading(false)
      return
    }

    const formattedMatches = data.map((match) => ({
      id: match.id,
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      venue: match.venue,
      price: match.price,
      availableSeats: match.available_seats
    }))

    setMatches(formattedMatches)
    setLoading(false)
  }

  fetchMatches()

  // Listen for database changes
  const channel = supabase
    .channel('matches-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches'
      },
      () => {
        fetchMatches()
      }
    )
    .subscribe()

  // Clean up subscription
  return () => {
    supabase.removeChannel(channel)
  }
}, [])


  // Insert booking and update available seats in Supabase
  async function confirmBooking({ matchId, quantity, userName }) {
    const match = matches.find((item) => item.id === matchId)

    if (
      !match ||
      !userName.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 6
    ) {
      return
    }

    try {
      // Step 1: Insert booking into the booking table
      const { data: bookingData, error: bookingError } = await supabase
        .from('booking')
        .insert([
          {
            match_id: matchId,
            user_name: userName,
            match_title: `${match.team1} vs ${match.team2}`,
            tickets: quantity,
            total_price: match.price * quantity
          }
        ])
        .select('id')
        .single()

      if (bookingError) {
        throw bookingError
      }

      // Step 2: Get the latest available seats from Supabase
      const { data: latestMatch, error: fetchError } = await supabase
        .from('matches')
        .select('available_seats')
        .eq('id', matchId)
        .single()

      if (fetchError) {
        await supabase
          .from('booking')
          .delete()
          .eq('id', bookingData.id)

        throw fetchError
      }

      if (quantity > latestMatch.available_seats) {
        await supabase
          .from('booking')
          .delete()
          .eq('id', bookingData.id)

        setConfirmation('Sorry, not enough tickets are available.')
        return
      }

      // Step 3: Update available seats in Supabase
      const { data: updatedMatch, error: updateError } = await supabase
        .from('matches')
        .update({
          available_seats: latestMatch.available_seats - quantity
        })
        .eq('id', matchId)
        .select()
        .single()

      if (updateError) {
        await supabase
          .from('booking')
          .delete()
          .eq('id', bookingData.id)

        throw updateError
      }

      // Step 4: Update React UI after successful database operations
      setMatches((currentMatches) =>
        currentMatches.map((item) =>
          item.id === matchId
            ? {
                ...item,
                availableSeats: updatedMatch.available_seats
              }
            : item
        )
      )

      setTotalBookings((currentTotal) => currentTotal + quantity)

      setConfirmation(
        `${quantity} ${quantity === 1 ? 'ticket' : 'tickets'} booked successfully for ${match.team1} vs ${match.team2}!`
      )

      setSelectedMatch(null)

    } catch (error) {
      console.error('Booking error:', error.message)
      setConfirmation('Booking failed. Please try again.')
    }
  }

  return (
    <>
      <Navbar totalBookings={totalBookings} />

      <main>
        <Hero />

        <section className="matches-section" id="matches">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE NEXT BIG GAME</p>
              <h2>Upcoming matches</h2>
            </div>

            <p className="section-note">
              Pick your match. Feel every moment.
            </p>
          </div>

          {confirmation && (
            <p className="booking-confirmation" role="status">
              {confirmation}
            </p>
          )}

          {loading ? (
            <p>Loading matches...</p>
          ) : error ? (
            <p>{error}</p>
          ) : matches.length === 0 ? (
            <p>No upcoming matches available.</p>
          ) : (
            <div className="match-grid">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isSelected={selectedMatch?.id === match.id}
                  onSelectMatch={(nextMatch) => {
                    setSelectedMatch(nextMatch)
                    setConfirmation('')
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="booking-section" id="booking">
          <div className="booking-copy">
            <p className="eyebrow">MAKE IT A MATCH DAY</p>
            <h2>Your seat is waiting.</h2>
            <p>
              Select a match above to choose your tickets and get ready
              for the action.
            </p>
          </div>

          {selectedMatch ? (
            <BookingForm
              key={selectedMatch.id}
              match={selectedMatch}
              onConfirm={confirmBooking}
              onCancel={() => setSelectedMatch(null)}
            />
          ) : (
            <div className="booking-placeholder">
              <span className="placeholder-icon" aria-hidden="true">
                ✦
              </span>
              <p>
                Your selected match and ticket options will appear here.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
