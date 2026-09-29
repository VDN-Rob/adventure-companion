# Welcome to the adventure companion app project

This is an expo project.

## Getting started coding side

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app after making sure that an android emulator is connected (USB, Android Studio, ...)

   ```bash
   npx expo run:android
   ```

## Getting started with the app

Coming to the play store in October!




## Purpose

Adventure Companion is an offline-first mobile application designed to support multi-day adventure trips - mostly based of my cycling experience.

The application aims at allowing adventurers to plan, navigate, document, and review a trip without requiring an, oh so needed or expensive, internet connection.

## Core elements
(many more details available - as you will discover)

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

* Synchronizing activities with Strava
* Downloading OpenStreetMap map data
* Other optional external data sources

## Core design principle

Having experience with adventure cycling, I strive to have the application remain fully usable even without internet connection.

Local data is therefore the primary source of truth - much like 42. Online services are optional integrations rather than dependencies of the core application.