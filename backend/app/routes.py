from flask import Blueprint, jsonify, request

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({"message": "Backend is up and running!"})

@main.route('/plan_trip', methods=['POST'])
def plan_trip():
    data = request.get_json()
    
    # Basic validation
    if not all(key in data for key in ("start_location", "destination", "budget", "travelers", "start_date", "end_date")):
        return jsonify({"error": "Missing required fields"}), 400
    
    return jsonify({
        "message": "Trip planned successfully",
        "data": {
            "start_location": data["start_location"],
            "destination": data["destination"],
            "budget": data["budget"],
            "travelers": data["travelers"],
            "start_date": data["start_date"],
            "end_date": data["end_date"]
        }
    })