from amadeus import Client, Location, ResponseError

amadeus = Client(
    client_id = 'XECWss78GS1IQDRzATLs5ZLgn4yJHciD',
    client_secret = 'QjRUixMB3gU9FSb8'
)

def fetch_flight_offers(origin, destination, depart, adults, max_price = None, return_date = None):
    try:
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin,
            destinationLocationCode=destination,
            departureDate=depart,
            adults=adults,
            currencyCode='USD'
        )
        
        flight_offers = sorted(response.data, key=lambda x: float(x['price']['total']))

        return flight_offers[0:4] if flight_offers else None
    except ResponseError as e:
        raise Exception(f"Amadeus API Error: {e.message}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")

def process_trip_data(data):
    start_location = data['start_location']
    destination = data['destination']
    budget = data['budget']
    travelers = data['travelers']
    start_date = data['start_date']
    end_date = data['end_date'] # Should be optional

    cheapest_flight = fetch_flight_offers(
        origin=start_location,
        destination=destination,
        depart=start_date,
        adults=travelers,
        max_price=budget / 3,
        return_date=end_date
    )
    
    
    if cheapest_flight:
        print(f"5 Cheapest flights: {cheapest_flight}")
    else:
        print("No flights were found")

    trip_summary = {
        'start_location': start_location,   
        'destination': destination,
        'budget': budget,
        'travelers': travelers,
        'start_date': start_date,
        'end_date': end_date,
        'cheapest_flight': cheapest_flight
    }

    return trip_summary