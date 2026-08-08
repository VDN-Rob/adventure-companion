# Cycling Companion

## Purpose

Cycling Companion is an offline-first mobile application designed to support multi-day bicycle trips.

The application should aims to allow touring cyclists to plan, navigate, document, and review a trip without requiring an, oh so needed or expensive, internet connection.

## Core requirements

### Trip planning

* Create and manage trips
* Divide trips into individual days
* Define planned routes and stops
* Store accommodation and other relevant information

### Navigation

* Display the current location
* Display planned GPX routes
* Display relevant map data offline
* Provide useful information during a ride

### Diary

* Write notes for each day or location
* Store photographs
* Store recorded cycling activities
* Review completed days

### Emergency

* Provide relevant emergency information based on the current location
* Make important emergency information available offline

### External services

Internet connectivity is only required for selected features, such as:

* Synchronizing cycling activities with Strava
* Downloading OpenStreetMap map data
* Other optional external data sources

## Core design principle

Having experience with cycling, I strive to have the application remain fully usable even without internet connection.

Local data is therefore the primary source of truth - much like 42. Online services are optional integrations rather than dependencies of the core application.
