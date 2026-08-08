# Architecture
/!\ subject to many changes throughout my work

## Initial architecture

The application will be a mobile application built with React Native and TypeScript.

The application will use local storage as its primary source of data. SQLite will be used for structured application data, while the device filesystem will be used for files such as photographs, GPX files, and FIT files.

External services will be accessed only when an internet connection is available.

```text
                    ┌─────────────────┐
                    │   Strava API    │
                    └────────┬────────┘
                             │
                         Synchronization
                             │
                             ▼
┌──────────────────────────────────────────────────┐
│              React Native Application             │
│                                                  │
│     UI → Application Logic → Local Storage       │
│                              │                   │
│                    ┌─────────┴─────────┐         │
│                    │                   │         │
│                 SQLite             Files        │
│                                  GPX/FIT/Photos │
└──────────────────────────────────────────────────┘

                    Optional internet
```

## Main technology choices

### React Native

React Native allows the application to target mobile platforms while using React and TypeScript.

### TypeScript

TypeScript provides static typing and will be used throughout the application.

### SQLite

SQLite is appropriate for structured, relational data stored locally on the device.

### Device filesystem

Files such as photographs, GPX tracks, and FIT activities should be stored outside the relational database, with references to those files stored in SQLite.

### OpenStreetMap

OpenStreetMap data will be used as the basis for map functionality, with the application designed to support offline map usage.

### Strava

Strava will be an optional external integration. The core application must not depend on Strava being available.
