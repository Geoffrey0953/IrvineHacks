def process_trip_data(data):
    start_location = data['start_location']
    destination = data['destination']
    budget = data['budget']
    travelers = data['travelers']
    start_date = data['start_date']
    end_date = data['end_date']

    trip_summary = {
        'start_location': start_location,   
        'destination': destination,
        'budget': budget,
        'travelers': travelers,
        'start_date': start_date,
        'end_date': end_date
    }

    return trip_summary

