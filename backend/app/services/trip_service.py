from amadeus import Client, Location, ResponseError
import googlemaps
from datetime import datetime
import os
from dotenv import load_dotenv
import boto3
import json

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")

# Client for Google Maps API
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

# AWS Client
bedrock_client = boto3.client('bedrock-runtime',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name='us-west-2')

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

        return flight_offers[0] if flight_offers else None
    except ResponseError as e:
        raise Exception(f"Amadeus API Error: {e.message}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")


def fetch_hotels_by_city(city, check_in_date, check_out_date, adults, radius=10):
    try:
        # Step 1: Fetch hotels by city (top 10 by rating)
        response = amadeus.reference_data.locations.hotels.by_city.get(
            cityCode=city,
            radius=radius  # Radius in kilometers
        )
        hotels = response.data

        if not hotels:
            raise Exception("No hotels found in the specified city")

        # Sort hotels by rating and select the top 10
        top_hotels = sorted(hotels, key=lambda x: x.get('rating', 0), reverse=True)[:10]
        hotel_ids = [hotel.get('hotelId') for hotel in top_hotels if hotel.get('hotelId')]

        print(f"Top 10 Hotel IDs by Rating: {hotel_ids}")

        if not hotel_ids:
            raise Exception("No valid hotel IDs found")

        # Step 2: Fetch hotel offers for these IDs
        offer_response = amadeus.shopping.hotel_offers_search.get(
            hotelIds=','.join(hotel_ids),  # Pass all IDs as a comma-separated string
            checkInDate=check_in_date,
            checkOutDate=check_out_date,
            adults=adults,
            currencyCode="USD"
        )
        hotel_offers = offer_response.data

        if not hotel_offers:
            raise Exception("No offers found for the specified hotels")

        # Find the cheapest hotel from the offers
        cheapest_hotel = min(
            [
                {
                    "name": hotel.get("hotel", {}).get("name", "Unknown Hotel"),
                    "rating": hotel.get("hotel", {}).get("rating", "N/A"),
                    "price": float(offer.get("price", {}).get("total", 0)),
                    "currency": offer.get("price", {}).get("currencyCode", "USD"),
                    "offer_id": offer.get("id"),
                }
                for hotel in hotel_offers
                for offer in hotel.get("offers", [])
            ],
            key=lambda x: x["price"],  # Find the hotel with the lowest price
            default=None
        )

        if not cheapest_hotel:
            raise Exception("No suitable hotel found based on price")

        # Print and return the cheapest hotel
        print("\nCheapest Hotel Found:")
        print(cheapest_hotel)
        return cheapest_hotel

    except ResponseError as e:
        print(f"Amadeus API Error: {e.code} - {e.description}")
        return None
    except Exception as e:
        print(f"Error fetching hotels: {e}")
        return None

def AWS_bedrock_sonnet(destination, budget, num_of_days, num_of_ppl):
    input_text = f"""
    \n\nHuman:
        You are an expert travel planner. Generate a detailed daily travel itinerary for a group of {num_of_ppl} people visiting {destination} for {num_of_days} days. The total budget is ${budget}, so ensure the itinerary stays within budget while balancing affordability and quality.

            For each day, provide a morning, afternoon, and night schedule that includes specific activities, attractions, meals, and downtime. Incorporate iconic landmarks, local experiences, and highly rated restaurants or cafes (budget-friendly where necessary). Ensure the itinerary covers a mix of cultural, recreational, and relaxation activities.

            The schedule should:
            1. Maximize the group's time while considering transportation and realistic travel durations.
            2. Include approximate costs for major activities, meals, and entrance fees.
            3. Provide recommendations for transportation methods between activities.
            4. Offer alternatives for weather conditions or preferences.

            Structure your response like this:

            **Day X**
            - **Morning**: [Activity/Attraction, Location=location, Details=details, Time=time, Cost=cost]
            - **Afternoon**: [Activity/Attraction, Location=location, Details=details, Time=time, Cost=cost]
            - **Night**: [Activity/Attraction, Location=location, Details=details, Time=time, Cost=cost]

            At the end of the itinerary, provide a brief cost breakdown and total estimated expenses.

            Example Output:            
            "01": ["Day":1, "Block":"Morning", "Activity":"Eiffel Tower", "Location":"Eiffel Tower", "Details":"Enjoy panoramic view learn about its history.", "Time":"9:00 AM - 11:30 AM", "Cost":"$25 per person"],
            "02": ["Day":1, "Block":"Afternoon", "Activity":"Lunch", "Location":"Stellar Restaurant", "Details":"Romantic vibes and authentic French cusine", "Time":"12:pp PM - 1:30 PM", "Cost":"$25 per person"],
            "03": ["Day":1, "Block":"Afternoon", "Activity":"Louvre Museum", "Location":"Eiffel Tower", "Details":"Learn about classic French art and culture.", "Time":"2:00 PM - 4:00 PM", "Cost":"$25 per person"],
            "04": ["Day":1, "Block":"Night", "Activity":"Dinner", "Location":"French Bistro", "Details":"Affordable fine-dining experience.", "Time":"5:00 PM - 7:00 PM", "Cost":"$40 per person"],
            "05": ["Day":1, "Block":"Night", "Activity":"Walk by Seine River", "Location":"Seine River", "Details":"Enjoy nighttime views of an iconic French landmark.", "Time":"7:00 PM - 8:00 PM", "Cost":"$0 per person"]

            Do not include any additional in order for the output to be readable as a Python dictionary and avoid truncation.
            Repeat this format exactly for the remaining days.
            End the output after the itinerary, do not provide accomodations, transportation, or total cost breakdown.
            

            Remember to keep the itinerary engaging, realistic, and tailored to the provided parameters.
    \n\nAssistant:
    """

    model_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    
    try:
        payload = {
            "anthropic_version": "bedrock-2023-05-31", 
            "max_tokens": 700,
            "messages": [
                {
                    "role": "user",
                    "content": input_text  # User's input text
                }
            ]
        }

        # Invoke the Bedrock model
        response = bedrock_client.invoke_model(
            modelId=model_id,
            body=json.dumps(payload),  # Serialize the payload to JSON
            contentType="application/json",
            accept="application/json"
        )

        # Read the StreamingBody content
        response_body = response["body"].read().decode("utf-8")  # Read and decode the response
        result = json.loads(response_body)  # Parse the JSON response

        # Print the model's output
        print(f"This is the result of AWS Bedrock Sonnet:  {result}")
        return result

    except Exception as e:
        print("Error:", str(e))

def process_trip_data(data):
    start_location = data['start_location']
    destination = data['destination']
    budget = data['budget']
    travelers = data['travelers']
    start_date = data['start_date']
    end_date = data['end_date']

    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    nights = (end - start).days + 1

    # Step 1: Fetch the cheapest flights
    cheapest_flight = fetch_flight_offers(
        origin=start_location,
        destination=destination,
        depart=start_date,
        adults=travelers,
        return_date=end_date,
    )

    if cheapest_flight:
        print(f"Cheapest flight options: {cheapest_flight}")
    else:
        print("No flights were found")

    # Step 2: Fetch hotel offers by city
    hotel_offers = fetch_hotels_by_city(
        city=destination,
        check_in_date=start_date,
        check_out_date=end_date,
        adults=travelers,
        radius=25  # Within a 25 km radius
    )

    trip_summary = {
    'start_location': start_location,
    'destination': destination,
    'budget': budget,
    'travelers': travelers,
    'start_date': start_date,
    'end_date': end_date,
    'cheapest_flight_price': cheapest_flight["price"]["total"] if cheapest_flight else None,
    'hotel_price': hotel_offers["price"] if hotel_offers else None,
    'hotel_name': hotel_offers["name"] if hotel_offers else None,
    # Outbound trip details
    'outbound_starting_terminal': cheapest_flight["itineraries"][0]["segments"][0]["departure"].get("terminal", "N/A") if cheapest_flight else None,
    'outbound_departure_airport': cheapest_flight["itineraries"][0]["segments"][0]["departure"]["iataCode"] if cheapest_flight else None,
    'outbound_departure_time': cheapest_flight["itineraries"][0]["segments"][0]["departure"]["at"] if cheapest_flight else None,
    'outbound_destination_terminal': cheapest_flight["itineraries"][0]["segments"][-1]["arrival"].get("terminal", "N/A") if cheapest_flight else None,
    'outbound_arrival_airport': cheapest_flight["itineraries"][0]["segments"][-1]["arrival"]["iataCode"] if cheapest_flight else None,
    'outbound_arrival_time': cheapest_flight["itineraries"][0]["segments"][-1]["arrival"]["at"] if cheapest_flight else None,
    # Return trip details
    'return_starting_terminal': cheapest_flight["itineraries"][1]["segments"][0]["departure"].get("terminal", "N/A") if cheapest_flight and len(cheapest_flight["itineraries"]) > 1 else None,
    'return_departure_airport': cheapest_flight["itineraries"][1]["segments"][0]["departure"]["iataCode"] if cheapest_flight and len(cheapest_flight["itineraries"]) > 1 else None,
    'return_departure_time': cheapest_flight["itineraries"][1]["segments"][0]["departure"]["at"] if cheapest_flight and len(cheapest_flight["itineraries"]) > 1 else None,
    'return_destination_terminal': cheapest_flight["itineraries"][1]["segments"][-1]["arrival"].get("terminal", "N/A") if cheapest_flight and len(cheapest_flight["itineraries"]) > 1 else None,
    'return_arrival_airport': cheapest_flight["itineraries"][1]["segments"][-1]["arrival"]["iataCode"] if cheapest_flight and len(cheapest_flight["itineraries"]) > 1 else None,
    'return_arrival_time': cheapest_flight["itineraries"][1]["segments"][-1]["arrival"]["at"] if cheapest_flight and len(cheapest_flight["itineraries"]) > 1 else None,
}
    
    AWS_bedrock_response = AWS_bedrock_sonnet(
        destination=trip_summary["destination"],
        budget=trip_summary["budget"],
        num_of_days=(nights),  # Calculating number of days
        num_of_ppl=trip_summary["travelers"]
    )

    return AWS_bedrock_response