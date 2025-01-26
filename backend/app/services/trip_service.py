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

    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    difference = (end - start).days + 1

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

    AWS_bedrock_response = AWS_bedrock_sonnet(destination, budget, difference, travelers)

    return AWS_bedrock_response

    # trip_summary = {
    #     'start_location': start_location,   
    #     'destination': destination,
    #     'budget': budget,
    #     'travelers': travelers,
    #     'start_date': start_date,
    #     'end_date': end_date,
    #     'cheapest_flight': cheapest_flight,
    #     'hotel_offers': hotel_offers[:5] if hotel_offers else []
    # }

    # return trip_summary


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
            - **Morning**: [Activity/Attraction with details, time, location, and cost]
            - **Afternoon**: [Activity/Attraction with details, time, location, and cost]
            - **Night**: [Activity/Attraction with details, time, location, and cost]

            At the end of the itinerary, provide a brief cost breakdown and total estimated expenses.

            Example Output:
            **Day 1**
            - **Morning**: Visit the Eiffel Tower. Enjoy panoramic views and learn about its history. [9:00 AM - 11:30 AM, Cost: $25 per person]
            - **Afternoon**: Lunch at a nearby café, followed by a guided tour of the Louvre Museum. [12:00 PM - 4:00 PM, Cost: $50 per person]
            - **Night**: Dinner at a local French bistro and an evening stroll along the Seine River. [6:30 PM - 9:30 PM, Cost: $40 per person]

            Repeat this format for the remaining days.

            Remember to keep the itinerary engaging, realistic, and tailored to the provided parameters.
    \n\nAssistant:
    """

    model_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    
    try:
        payload = {
            "anthropic_version": "bedrock-2023-05-31", 
            "max_tokens": 600,
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
