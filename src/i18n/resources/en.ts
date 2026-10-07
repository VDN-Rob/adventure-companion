
export const en = {
    adventures: {
        adventure: "adventure",
        adventures: "adventures",

        // Common
        editAdventure: "edit adventure",
        adventureSystem: "adventure system",
        newAdventure: "New adventure",
        detailsAdventure: "adventure details",

        // Main screen
        activeAdventureTitle: "Active adventure",
        noActiveAdventure: "No active adventure",
        noActiveAdventureDesc: "You are currently between adventures.",

        upcomingAdventureTitle: "Upcoming adventure",
        noUpcomingAdventure: "No upcoming adventure",
        noUpcomingAdventureDesc: "You have no pending adventures. Get to planning!",


        pastAdventureTitle: "Past adventure",
        noPastAdventure: "No past adventures",
        noPastAdventureDesc: "You have no past adventures. Time to set off!",
        
        // Details screen
        loadingAdventure: "Loading adventure...",
        
        notFound: "Adventure not found",
        notFoundDesc: "Unable to load this adventure.",

        statAdventure: "of adventure",
        
        subHeader: "Mission briefing",
        scheduleSectionTitle: "Schedule",

        noDays: "No days planned",
        noDaysDesc: "You have yet to plan anything on this adventure. Add the first day to begin planning.",

        offlineMapDesc: "Download map data before heading out of range.",

        // Edit screen
        currentAdventure: "current adventure",
        adventureTitle: "adventure title",

        adventureDesc: "Describe this adventure...",

        delDesc: "Permanently remove this adventure and its associated data.",
        delAdventure: "DELETE ADVENTURE",
        delAdventureDesc: "This adventure and its planned days, POIs and other data will be permanently removed. This action cannot be undone.",

        // Create screen
        planJourney: "plan your next journey",
        planJourneyDesc: "Set the basics now. You can add days, routes, points of interest and diary entries later.",
        defaultAdventure: "Cycling trip",
        descPlaceholder: "A few words about this adventure...",
        beginPlanning: "BEGIN PLANNING",
        createAdventure: "CREATE ADVENTURE",


    },

    finance: {
        finance: "finance",
        finances: "finances",
        budget: "budget",
        expenses: "expenses",
        remaining: "remaining",
        currency: "currency",
    },

    maps: {
        map: "map",
        maps: "maps",
        offlineMaps: "offline maps",

        downloadingMaps: "downloading maps...",
        downloadMaps: "download maps",
    },

    diary: {
        diary: "diary"
    },

    day: {
        day: "day",
        days: "days",
        untitledDay: "UNTITLED DAY",

        // Create screen
        adventurePlanner: "ADVENTURE PLANNER",
        planDay: "PLAN DAY",

        details: "DAY DETAILS",

        title: "DAY TITLE",
        titlePlaceholder: "Through the Ardennes",

        save: "SAVE DAY",

        // Details screen
        plannedDistance: "PLANNED DISTANCE",

        pointsOfInterest: "POINTS OF INTEREST",
        noWaypoints: "NO WAYPOINTS",
        nothingPlanned: "Nothing has been planned for this day yet.",

        addPointOfInterest: "ADD POINT OF INTEREST",
        openMap: "OPEN MAP",
        downloadOfflineMap: "DOWNLOAD OFFLINE MAP",
        loadGPX: "Load GPX",
        editDay: "EDIT DAY",

        loading: "LOADING DAY...",
        notFound: "DAY NOT FOUND",
        unableToLoad: "Unable to load this day.",

        // Edit screen
        date: "DATE",

        planning: "PLANNING",
        distance: "DISTANCE",
        elevation: "ELEVATION",
        distancePlaceholder: "85",
        elevationPlaceholder: "1200",

        notesSection: "DAY NOTES",
        notes: "NOTES",
        notesPlaceholder: "What do you need to remember?",

        saveChanges: "SAVE CHANGES",

        dangerZone: "DANGER ZONE",
        deleteDay: "DELETE DAY",
        deleteDescription:
            "Permanently remove this day and its POIs.",

        deleteConfirmation: {
            title: "DELETE DAY?",
            message:
                "This day and its planned points of interest will be permanently removed. This action cannot be undone.",
            confirm: "DELETE",
            cancel: "KEEP DAY",
        },
    },

    time: {
        startDate: "start date",
        endDate: "end date",
        date: "date",
        datePlaceholder: "2026-08-28",

    },

    homeScreen: {
        noAdventure: "No active adventure",
        noAdventureDesc: "Start or join an adventure to begin your journey.",
        currentAdventure: "Current adventure",
        selectAdventure: "Select adventure",
        multAdventuresDesc: "You have multiple active adventures today.",
        viewAdventures: "View adventures",
        infinity: "To Infinity!",

        restDayTitle: "Rest day",
        restDayDesc: "Nothing planned for today.",

        dayPlanner: "Day planner",
        checkIn: "Check in",
        addExpense: "Add expense",
    },

    dayCard: {
        noTitle: "Untitled day",
        today: "Today",
        noPOIDesc: "No POIs planned for today"
    },

    moreScreen: {
        more: "more",
        title: "Menu",
        subTitle: "Pick your poison",

        adventuresDesc: "Your adventures",
        financesDesc: "Money spent on the road",
        diaryDesc: "Your memories from the road",
        mapsDesc: "Your downloaded maps",

        settings: "Settings",
    },

    settings: {
        title: "Settings",
        language: "Language",
        currency: "Currency",
        timeFormat: "Time format",

        timeFormat24: "24-hour",
        timeFormat12: "12-hour",

        timeFormat24Description: "Example: 18:30",
        timeFormat12Description: "Example: 6:30 PM",
    },

    common: {
        appName: "Elg Wander",

        home: "Home",
        poi: "POI",
        title: "title",
        description: "description",
        optional: "Optional",
        distance: "distance",
        elevation: "elevation",

        cancel: "cancel",
        confirm: "confirm",
        save: "save",
        delete: "delete",
        next: "next",
        download: "download",
        dangerZone: "danger zone",

        to: "to",
    },

    units: {
        kmAbr: "km",
        km: "kilometer",

        mAbr: "m",
        m: "meter",
    },

    alerts: {
        noInternetConnection: {
            title: "No internet connection",
            message:
                "In order to perform this action, please connect to the internet.",
        },

        downloadFailedNoDay: {
            title: "Download failed",
            message: "No day was selected.",
        },

        noMapData: {
            title: "No map data",
            message: "Unable to retrieve local data for the map. Have you downloaded it?",
        },

        mapAlreadyDownloaded: {
            title: "Map already downloaded",
            message:
                "The required map area is already available offline.",
        },

        downloadComplete: {
            title: "Download complete",
            message:
                "The map for this day is now available offline.",
        },

        downloadFailed: {
            title: "Download failed",
            message:
                "The offline map could not be downloaded.",
        },

        gpxImported: {
            title: "GPX imported",
            message:
                "The route was imported successfully.",
        },

        importFailed: {
            title: "Import failed",
            message:
                "The GPX file could not be imported.",
        },

        downloadMaps: {
            title: "Download maps",
            message: "Download offline map data for each planned day. " +
			"Areas that are already available offline will not be downloaded again.",
        },
        
        invalidAdventure: {
            title: "Invalid adventure",
        },
        
        savingAdventureError: {
            title: "Could not save adventure",
            message: "The adventure contains invalid data."
        }, 

        invalidDayChange: {
            title: "Invalid day change",
        },

        couldNotSaveDay: {
            title: "Could not save day",
            fallbackMessage:
                "The day contains invalid data.",
        },
    }
};