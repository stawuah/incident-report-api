# Incident Reporting API 
An API for precise incident tracking tailored for insurance clients, enabling efficient search and delivery of accurate information

The incident API utilizes dependency injection to decouple components and improve testability. Key dependencies such as the database connection, external API services, and other services are injected into the appropriate components.

## Installation

1. Clone the repository:
   
   `git clone https://github.com/yourusername/incident-api.git`

2. Install required packages:   `npm i`

 3 Ensure to configure the environment variables :
   
   ```
       PORT="LOCAL_SERVER_PORT_NUMBER"
       API_KEY="YOUR_WEARTHER_API_KEY"
       DATABASE_CONNECTION="DATABASE CONNECTION URI"
   ```

4. To initiate the application, execute either `make dev` or `npm run dev` command.


## Running Tests :

5. To run test, execute either `make test` or `npm run test` command.


   
  ## API functionalities :

### First API functionality :

- A `POST` endpoint that receives the incident report.
- The endpoint receives the report, adds weather data and stores it in a table “incidents”.
- The weather report should be fetched from the API service of https://openweathermap.org/current

> [!IMPORTANT]
> A live URL for the api to send a post request : https://incident-report-api-bnfb.onrender.com/api/report-incident


### Second Api functionality :
 - A `POST` endpoint that searches for incidents based on `country name`.
  
> [!IMPORTANT]
>  A live URL for the api that searches for incidents based on country name : https://incident-report-api-bnfb.onrender.com/api/search


### Third Api functionality :
- A `GET` endpoint that lists all the incidents.
- The endpoint should have the capability of filtering the data by `city`, `temperature range` and `humidity range`.
- NB : This URL below is tailored to filter incidents by city, temperature range, and humidity

> [!IMPORTANT]
>  A live URL for the api that has the capability of filtering the data by city, temperature range, humidity range and list all incidents : https://incident-report-api-bnfb.onrender.com/api/fetch-incident-report?city=Accra&temp_min=304&temp_max=306



## Published API documentation

> [!NOTE]
> URL for published API documentation
https://documenter.getpostman.com/view/31616104/2sA35G322U
