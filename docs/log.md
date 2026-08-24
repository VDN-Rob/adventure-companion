# Step 1 - Building application

## Checklist
# Environment
[X] Node installed
[X] Git installed
[X] VS Code configured
[X] Expo installed/available
[X] Expo Go installed on phone

# Project
[X] React Native app created
[X] App runs on physical phone
[X] Git repository created
[X] Initial commit pushed to GitHub

# Understanding
[X] Understand package.json
[X] Understanding what Expo does
[X] Understanding React components
[X] Understanding React state
[X] Understanding TypeScript interfaces

# Code
[X] Trip model created
[X] Day model created
[X] Basic home screen
[X] "New Trip" interaction
[X] Clean architecture - refactoring from the example app

# Documentation
[X] Requirements written
[X] Initial architecture documented
[X] Learning log started



## Step 2 - Trips and persistent storage

# SQLite
[X] expo-sqlite installed
[X] Database opens successfully
[X] trips table created
[X] Understanding primary keys
[X] Understanding CRUD
[X] Understanding parameterized queries

# Application
[X] Trips can be created
[X] Trips can be displayed
[X] Trips can be edited
[X] Trips can be deleted
[X] Data survives an application restart

# Architecture
[X] UI doesn't contain SQL
[X] Repository handles database operations
[X] SQLite is the local source of truth
[X] SQLite and persistent local storage.



# Step 3 - Trip and Day planning

# Data
[X] Day model created
[X] Stop model created
[X] days table created
[X] pois table created
[X] Foreign keys understood
[X] Trip → Days relationship works
[X] Day → POIs relationship works

# UI
[X] Trip details screen
[X] Day list
[X] Create day
[X] Edit day
[X] Delete day
[X] Create POI
[X] Edit POI
[X] Delete POI
[X] Empty states

# Architecture
[X] Day repository
[X] POI repository
[X] SQL remains outside UI
[X] Reusable cards/components
[X] Navigation parameters understood
[-] Validation implemented
[-] Derived trip statistics implemented

# Offline
[X] Create data in airplane mode
[X] Data remains available
[X] Editing works offline
[X] Deletion works offline



# Step 4 — Offline-first architecture

# Architecture
[X] Offline-first principles documented
[X] Local data identified
[X] External data vs local data understood
[ ] Services separated from repositories
[ ] UI no longer contains application/business logic unnecessarily
[ ] Network access abstracted
[ ] Error-handling approach established

# Offline behaviour
[ ] App works in airplane mode
[ ] Existing data works offline
[ ] New data can be created offline
[ ] Data can be edited offline
[ ] Data can be deleted offline
[ ] App survives network transitions

# Synchronization preparation
[ ] Synchronization concept documented
[ ] External IDs understood
[ ] Idempotency understood
[ ] Sync failures considered
[ ] Future Strava integration has a clear place in the architecture

# Files
[ ] Decision made to store large files outside SQLite
[ ] SQLite will store file metadata/references
[ ] Filesystem architecture documented

# Documentation
[X] offlinFirst.md
[ ] synchronization.md
[ ] ADR 001
[ ] Architecture diagram updated
[ ] Learning log updated

# Step 5 — Maps & OpenStreetMap
# Step 6 — GPX & route data
# Step 7 — Diary, photos & FIT
# Step 8 — GPS & navigation
# Step 9 — Strava integration
# Step 10 — Testing
# Step 11 — CI/CD & professionalisation
# Step 12 — Portfolio & interview preparation