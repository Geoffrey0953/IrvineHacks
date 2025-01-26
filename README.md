# IrvineHacks

## Inspiration
Traveling can be stressful and time-consuming, especially when it involves searching for affordable flights, quality accommodations, and exciting activities. We wanted to build something that simplifies the entire planning process while keeping it personalized to your preferences and budget. The idea for Planit was born out of a desire to create a one-stop solution for effortless travel planning.

## What it does
Planit is your ultimate travel companion. With just a few simple inputs, it helps you:

* Find the cheapest flights based on your travel dates and locations.
* Discover the highest-rated hotels within your budget.
* Get tailored restaurant recommendations near your destination.
* Generate a detailed day-by-day itinerary that includes flights, hotels, and activities.
* Planit takes the hassle out of planning so you can focus on enjoying your journey.

## How we built it
Frontend: Built using React with TailwindCSS to make our UI responsive and interactive! Backend: Developed using Flask, integrated with the Amadeus API for flight and hotel data, and AWS Bedrock using Claude Sonnet to generate itineraries and recommendations Design: Focused on an intuitive and interactive user experience.

## Challenges we ran into
We weren't too familiar with the Amadeus API initially, so we spent a lot of time using the Google Places API to get all of our information, but geocoding each location took a lot of time. We decided to pivot and move to Amadeus as it provided all the necessary information.

## Accomplishments that we're proud of
Successfully integrating flight, hotel, and restaurant recommendations into a single application. Creating an engaging and visually appealing UI that users will enjoy interacting with.

## What we learned
How to work with third-party APIs like Amadeus to fetch and process travel-related data. Effective team collaboration and the value of iterative design to build a user-focused product. Using AWS Bedrock to add scalability to our application.

## What's next for Planit
**Scalability and Performance:** With AWS Bedrock, Planit will enhance its scalability, allowing it to handle a larger user base while maintaining low latency for itinerary generation and travel suggestions. **Expanding User Preferences:** Planit will introduce more customizable preferences, allowing users to tailor their travel plans based on specific interests such as eco-friendly accommodations, dietary restrictions, pet-friendly options, or accessibility needs. This will make Planit more inclusive and adaptable to a broader audience.
**Storing and Collaboration:** While solo travel can be thrilling, many prefer to travel with friends or family. Connecting with Google Calendar will bring collaboration to Planit, and setting up a storage system for saving different versions of itineraries for the same trip makes Plantit the ultimate customizable travel companion.
