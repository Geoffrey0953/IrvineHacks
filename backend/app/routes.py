from flask import Blueprint, jsonify, request
from app.services.trip_service import process_trip_data

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({"message": "Backend is up and running!"})

@main.route('/plan_trip', methods=['POST'])
def plan_trip():
    data = request.get_json()
    print("Received data:", data)
    
    if not all(key in data for key in ("start_location", "destination", "budget", "travelers", "start_date", "end_date")):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        trip_summary = process_trip_data(data)
        return jsonify({"message": "Trip planned successfully", "data": trip_summary})
    except Exception as e:
        return jsonify({"error": str(e)}), 500