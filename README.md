# Movie Review Aggregator

## Overview

The Movie Review Aggregator is a web application that allows users to search for movies and view their reviews. It integrates with the TMDb API to fetch movie details and reviews and stores them in a PostgreSQL database.

The application is built using Node.js and utilizes the Express.js framework for handling HTTP requests. Sequelize is used as the ORM (Object-Relational Mapping) tool for interacting with the database.

## Design Decisions

### Technology Stack

- Node.js

- Express.js

- Sequelize

- PostgreSQL
  

### Architecture

The application follows a layered architecture, separating concerns into different modules:

- **Routes**: Defines the API endpoints and their corresponding request handlers.
- **Controllers**: Contains the business logic and implements the logic to handle HTTP requests, interacts with models, and returns responses.
- **Models**: Represents the database schema 
- **Services**: Handle request to the TMDB API


### Database Schema

The database schema consists of two tables: `movies` and `reviews`. The `movies` table stores information about movies, such as their title, release date, vote average, and IMDb ID. The `reviews` table stores review details, including the author, content, and the associated movie ID.
The `movies` and `reviews` tables have a one-to-many relationship, where one movie can have multiple reviews. This relationship is established using foreign key constraints.

## Running the Application

### Prerequisites

- Docker
- Docker-Compose

### Installation

1. Clone the repository:

`git clone https://github.com/your-username/movie-review-aggregator.git`

2. Navigate to the project directory:

`cd movie-review-aggregator`

3. Install dependencies:

`docker-compose --build`

### Configuration

1. Create a `.env` file in the project root directory.

2. Add the following environment variables to the `.env` file:
   
```
API_KEY=<YOUR TMDB API KEY>
TMDB_BASIC_URL=https://api.themoviedb.org/3/
DATABASE_PASSWORD = <YOUR DB PASSWORD>
```

### Starting the Application

To start the application, run the following command:

`docker-compose up`

The application will be running at `http://localhost:3000`.

## API Endpoints

The application exposes the following API endpoints:

- `GET /movies/tmdb`: Retrieves a list of all movies. 
- `GET /movies/tmdb/:id/reviews`: Retrieves all the reviews for a specific movie by its ID from TMDB API.
- `GET /movies/local/:id/`: View details and reviews for a movie stored in local database.
- `PUT /movies/local/:id/`: Update a specific movie reviews in the local database. Existing reviews are not being updated because that would lead to inconstistencies between TMDB API data and local data. Hence, the user can update the reviews of a movie with new ones. 


## Adminer

An Adminer instance will also be running at `http://localhost:3000` giving the capabillity to view the stored data in a Graphical User Interface.

# Challenges

## API Choice: TMDB vs IMDB

The Movie Review Aggregator utilizes the TMDB (The Movie Database) API for fetching movie details and reviews. The decision to use TMDB API was based on several factors.

### IMDB API Limitations

Initially, the plan was to integrate with the IMDB (Internet Movie Database) API due to its popularity and comprehensive movie data. However, obtaining access to the IMDB API was not feasible as the request for a free trial was declined by their side. The IMDB API comes with usage limitations and requires a paid subscription for full access.

### TMDB API Features and Flexibility

As an alternative, the TMDB API emerged as a suitable choice for our application. The TMDB API is a free to use API that provides extensive movie data, including information on titles, release dates, ratings, and reviews. Notably, TMDB allows requesting movie data using the IMDB ID as well, which aligns with our requirements.


## Feature Changes

If I had more time I would consider to implement below options:

* Caching Layer: Introduce a caching layer, such as Redis, to cache frequently accessed movie data, reviews, and other frequently requested information. This can significantly improve application performance and reduce the load on the database.

* Monitoring and Logging: Set up a comprehensive monitoring and logging solution to track application performance, identify bottlenecks, and troubleshoot issues.

* Unittesting: Including unit tests is an important aspect of software development to ensure the quality and reliability of the codebase.

* Continuous Integration and Deployment (CI/CD): Implement a CI/CD pipeline to automate the build, testing, and deployment processes.
