let selectedSeat = null;

// Fetch seat data from Flask API
function fetchSeats() {
    axios.get('/api/seats')
        .then(response => {
            const seats = response.data;
            const seatContainer = document.getElementById('seats');
            seatContainer.innerHTML = '';  // Clear any existing seat data

            // Create seat elements based on the data
            seats.forEach(seat => {
                const seatElement = document.createElement('div');
                seatElement.classList.add('seat');
                seatElement.classList.add(seat.is_reserved ? 'reserved' : 'available');
                seatElement.textContent = seat.seat_number;
                seatElement.onclick = () => selectSeat(seat);
                seatContainer.appendChild(seatElement);
            });
        })
        .catch(error => {
            console.error('Error fetching seats:', error);
        });
}

// Select a seat to book or cancel
function selectSeat(seat) {
    if (seat.is_reserved) {
        showMessage(`Seat ${seat.seat_number} is already reserved.`);
    } else {
        selectedSeat = seat.seat_number;
        showMessage(`Seat ${seat.seat_number} selected.`);
    }
}

// Book the selected seat
function bookSeat() {
    if (selectedSeat === null) {
        showMessage('Please select a seat first.');
        return;
    }

    axios.post('/api/book_seat', { seat_number: selectedSeat })
        .then(response => {
            showMessage(response.data.message);
            fetchSeats();  // Refresh the seats after booking
        })
        .catch(error => {
            showMessage(error.response.data.message || 'Error booking seat.');
        });
}

// Cancel the selected seat reservation
function cancelSeat() {
    if (selectedSeat === null) {
        showMessage('Please select a seat first.');
        return;
    }

    axios.post('/api/cancel_seat', { seat_number: selectedSeat })
        .then(response => {
            showMessage(response.data.message);
            fetchSeats();  // Refresh the seats after cancellation
        })
        .catch(error => {
            showMessage(error.response.data.message || 'Error canceling seat.');
        });
}

// Show status message
function showMessage(message) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    fetchSeats();
});
