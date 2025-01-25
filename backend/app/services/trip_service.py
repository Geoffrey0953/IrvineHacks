from amadeus import Client, Location, ResponseError
import googlemaps
from datetime import datetime
import os
from dotenv import load_dotenv


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Client for Google Maps API
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

# Client for Amadeus
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


def fetch_hotels_by_city(city, radius, ratings=None):
    try:
        response = amadeus.reference_data.locations.hotels.by_city.get(
            cityCode = city,
            radius=radius,
            ratings=ratings
        )

        hotel_offers = sorted(
            response.data,
            key=lambda x: x.get('hotel', {}).get('rating', 0),
            reverse=True 
        )

        return hotel_offers

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
    end_date = data['end_date']

    # Returns the cheapest flights
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

    # Returns highest rated hotels by city 
    hotel_offers = fetch_hotels_by_city(
        city=destination,
        radius=25, # Within a 25 km radius
        ratings= ','.join(map(str, range(3, 6))) # Minimum rating is 3 stars and max is 5
    )

    if hotel_offers:
        print(f"Top rated hotels in the city: {hotel_offers[:3]}")
    else:
        print("Nothing was found")

    trip_summary = {
        'start_location': start_location,   
        'destination': destination,
        'budget': budget,
        'travelers': travelers,
        'start_date': start_date,
        'end_date': end_date,
        'cheapest_flight': cheapest_flight,
        'hotel_offers': hotel_offers[:5] if hotel_offers else []
    }

    return trip_summary

# returns a dictionary of 20 restaurants from Google
def fetch_restaurants():
    loc = '40.7128,-74.0060' # data['destination'] # Has to be Longitude/Latitude
    r = 10000
    keyword = 'restaurant'

    try:
        query_result = gmaps.places_nearby(
            location=loc,
            radius=r,
            keyword=keyword,
            type="restaurant"
        )

        food_dict = {}
        for place in query_result.get("results", []):
            food_dict[place["place_id"]] = {
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": place.get("rating"),
                "user_ratings_total": place.get("user_ratings_total"),
                "price_level": place.get("price_level"),
                "place_id": place.get("place_id"),
            }

        return food_dict

    except Exception as e:
        print(f"Error fetching restaurants: {e}")
        return {}
    
print(fetch_restaurants())


# Sort based off of rating and price level accordingly to the user's budget
# Location should be based off of attractions (use it as a parameter) given by the AI model