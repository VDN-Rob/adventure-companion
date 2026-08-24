# Synchronization

The application treats local data as the source of truth.

External data is imported through synchronization services.

Synchronization must:
- avoid creating duplicates
- preserve local data
- handle network failures
- be retryable
- be safe to execute multiple times

Future external integrations may include:
- Strava
- OpenStreetMap
- other optional services