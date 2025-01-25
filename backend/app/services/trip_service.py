from amadeus import Client, Location, ResponseError
import os
from dotenv import load_dotenv

load_dotenv()

amadeus = Client(
    client_id = os.getenv("CLIENT_ID"),
    client_secret = os.getenv('CLIENT_SECRET')
)

def fetch_flight_offers(origin, destination, depart, adults, return_date):
    try:
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin,
            destinationLocationCode=destination,
            departureDate=depart,
            returnDate=return_date,
            adults=adults,
            currencyCode='USD'
        )
        
        flight_offers = sorted(response.data, key=lambda x: float(x['price']['total']))

        return flight_offers[0:2] if flight_offers else None
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
        return_date=end_date,
    )
    
    
    if cheapest_flight:
        print(f"3 Cheapest flights: {cheapest_flight}")
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