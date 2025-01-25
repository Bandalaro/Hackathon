# app.py
from flask import Flask, render_template, jsonify, request

app = Flask(__name__, template_folder='app/templates')


# In-memory seat data (50 seats numbered from 1 to 50)
seats = {i: {'is_reserved': False} for i in range(1, 51)}

# Route to view available seats
@app.route('/api/seats', methods=['GET'])
def get_seats():
    return jsonify([{'seat_number': seat, 'is_reserved': data['is_reserved']} for seat, data in seats.items()])

# Route to book a seat
@app.route('/api/book_seat', methods=['POST'])
def book_seat():
    seat_number = request.json.get('seat_number')

    # Ensure the seat is available
    if seat_number not in seats:
        return jsonify({"message": "Seat not found!"}), 404
    if seats[seat_number]['is_reserved']:
        return jsonify({"message": "Seat is already reserved!"}), 400

    # Mark the seat as reserved
    seats[seat_number]['is_reserved'] = True
    return jsonify({"message": f"Seat {seat_number} booked successfully!"})

# Route to cancel a booking
@app.route('/api/cancel_seat', methods=['POST'])
def cancel_seat():
    seat_number = request.json.get('seat_number')

    # Ensure the seat exists
    if seat_number not in seats:
        return jsonify({"message": "Seat not found!"}), 404
    if not seats[seat_number]['is_reserved']:
        return jsonify({"message": "Seat is not reserved!"}), 400

    # Release the seat
    seats[seat_number]['is_reserved'] = False
    return jsonify({"message": f"Reservation for seat {seat_number} has been canceled!"})

# Route to render the HTML page (for frontend)
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
