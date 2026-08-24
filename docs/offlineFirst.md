# Offline-first principles

## Rule 1 — Local data is the source of truth

There are three types of data:
- user-owned data (trips, days, pois, ...)
- imported data (GPX, FIT, downloaded map data, ...)
- remote data (not yet downloaded map data, strava user data, ...)

remote data does NOT have the priority


## Rule 2 — The application must not require a network connection

The user must be able to:
- open the application
- view trips
- create trips
- edit trips
- delete trips
- plan days
- edit POIs
- view previously downloaded information

without an internet connection.

## Rule 3 — Network services are optional

Internet connectivity is only required for features such as:
- downloading map data
- synchronizing with Strava
- retrieving external information
- sharing elements

## Rule 4 — Network failures must not destroy local functionality

If a network request fails, locally stored data remains available.

## Rule 5 — External data is imported into the local model

Once external data has been successfully downloaded, the application should store the relevant information locally so that it can subsequently be used offline.