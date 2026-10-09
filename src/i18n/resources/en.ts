
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
        finances: "finances",
        budget: "budget",
        expenses: "expenses",
        remaining: "remaining",
        adventureFinance: "ADVENTURE FINANCE",
        finance: "FINANCE",

        conversionNotice: (count: number) => `${count} expense${count === 1 ? "" : "s"} awaiting exchange rate${count === 1 ? "" : "s"}.`,

        adventureLog: "ADVENTURE LOG",
        recentExpenses: "RECENT EXPENSES",
        noExpenses: "NO EXPENSES",
        noExpensesMessage: "Your adventure spending will appear here.",

        addExpense: "ADD EXPENSE",

        editExpense: "EDIT EXPENSE",

        amount: "AMOUNT",
        amountLabel: "Amount",
        amountPlaceholder: "0.00",

        currency: "Currency",

        category: "CATEGORY",

        details: "DETAILS",
        description: "Description",
        descriptionPlaceholder: "What did you spend it on?",
        date: "Date",
        datePlaceholder: "2026-08-29",

        saveChanges: "SAVE CHANGES",
        deleteExpense: "DELETE EXPENSE",

        categories: {
            food: "Food",
            transport: "Transport",
            accommodation: "Stay",
            gear: "Gear",
            other: "Other",
        },

        deleteConfirmation: {
            title: "Delete expense?",
            message: "This expense will be permanently removed.",
            cancel: "Cancel",
            confirm: "Delete",
        },
        loadingExpense: "LOADING EXPENSE...",
        newExpense: "NEW EXPENSE",
        saveExpense: "SAVE EXPENSE",
    },

    maps: {
        map: "map",
        maps: "maps",
        offlineMaps: "offline maps",

        downloadingMaps: "downloading maps...",
        downloadMaps: "download maps",
    },

    diary: {
        diary: "diary",
        back: "BACK",
        newEntry: "NEW DIARY ENTRY",

        date: "DATE",
        entryDate: "ENTRY DATE",

        entry: "ENTRY",
        title: "Title",
        titlePlaceholder: "A day worth remembering",

        story: "Story",
        optional: "OPTIONAL",
        storyPlaceholder: "What happened today?",

        photos: "PHOTOS",
        addPhoto: "ADD PHOTO",
        photoCount: (count: number) => `${count}/3 photos`,

        saving: "SAVING...",
        saveEntry: "SAVE ENTRY",

        loadingAdventure: "Loading adventure...",
        adventureNotFound: "The selected adventure could not be found.",

        loading: "Loading diary...",

        somethingWentWrong: "SOMETHING WENT WRONG",

        memories: "MEMORIES",
        intro: "Revisit the days, places and moments that made each adventure yours.",

        yourAdventures: "YOUR ADVENTURES",

        noAdventuresYet: "NO ADVENTURES YET",
        noAdventuresMessage: "Create an adventure first and your memories will appear here.",

        editEntry: "EDIT DIARY ENTRY",

        saveChanges: "SAVE CHANGES",
        deleteEntry: "DELETE ENTRY",

        deleteConfirmation: {
            title: "Delete diary entry?",
            message: "This memory will be permanently deleted.",
            cancel: "Cancel",
            confirm: "Delete",
        },
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

    poi: {
        types: {
            food: {
                label: "FOOD",
                description: "Restaurant, café or meal stop",
            },
            water: {
                label: "WATER",
                description: "Spring, fountain or refill",
            },
            supermarket: {
                label: "SHOP",
                description: "Supplies and groceries",
            },
            accommodation: {
                label: "CAMP",
                description: "Hotel, campsite or shelter",
            },
            other: {
                label: "OTHER",
                description: "Anything else worth marking",
            },
        },

        adventurePlanner: "ADVENTURE PLANNER",
        newPoi: "NEW POI",

        markWaypoint: "MARK A WAYPOINT",
        introText:
            "Add something worth remembering along today's route.",

        waypointDetails: "WAYPOINT DETAILS",
        name: "NAME",
        namePlaceholder: "Mountain café",
        waypointType: "WAYPOINT TYPE",

        type: "TYPE",

        location: "LOCATION",
        latitude: "LATITUDE",
        latitudePlaceholder: "50.1234",
        longitude: "LONGITUDE",
        longitudePlaceholder: "4.5678",

        locationHint:
            "Coordinates are optional. You can add them later when the route/map is ready.",

        notes: "NOTES",
        notesPlaceholder:
            "What should you remember about this place?",

        addToToday: "ADD TO TODAY",
        markWaypointButton: "MARK WAYPOINT",

        noDaySelected: "NO DAY SELECTED",
        noDaySelectedMessage: "This point of interest cannot be created without a day.",
        goBack: "GO BACK",

        editPoi: "EDIT POI",

        locationHintShort: "Coordinates are optional.",

        waypointData: "WAYPOINT DATA",
        saveChanges: "SAVE CHANGES",

        dangerZone: "DANGER ZONE",
        deletePoi: "DELETE POI",
        deleteDescription: "Permanently remove this waypoint.",

        deleteConfirmation: {
            title: "DELETE POI?",
            message: "This point of interest will be permanently removed from the day. This action cannot be undone.",
            confirm: "DELETE",
            cancel: "KEEP POI",
        },

        loading: "Loading...",
    },

    time: {
        startDate: "start date",
        endDate: "end date",
        date: "date",
        datePlaceholder: "2026-08-28",

    },

    homeScreen: {
        noAdventure: "No active adventure",
        noAdventureDesc: "Create an adventure below or continue planning.",
        currentAdventure: "Current adventure",
        selectAdventure: "Select adventure",
        multAdventuresDesc: "You have multiple active adventures today.",
        continuePlanning: "CONTINUE PLANNING",
        createAdventure: "CREATE NEW ADVENTURE",
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

        couldNotSavePOI: {
            title: "Could not save POI",
            fallbackMessage:
                "The POI contains invalid data.",
        },

        invalidPoi: {
            title: "Invalid POI",
        },

        photoLimit: {
            title: "Photo limit",
            message:
                "A diary entry can contain up to three photos.",
        },

        photoPermissionRequired: {
            title: "Permission required",
            message:
                "Please allow access to your photos to add pictures to your diary.",
        },

        missingAdventure: {
            title: "Missing adventure",
            message: "No adventure was specified.",
        },

        adventureUnavailable: {
            title: "Adventure unavailable",
            message:
                "The selected adventure could not be found.",
        },

        missingDiaryTitle: {
            title: "Missing title",
            message:
                "Please give your diary entry a title.",
        },

        invalidDiaryDate: {
            title: "Invalid date",
            message:
                "The diary entry date must be inside the adventure.",
        },

        diaryEntryAlreadyExists: {
            title: "Diary entry already exists",
            message:
                "There is already a diary entry for this date. Please choose another date.",
        },

        couldNotSaveDiaryEntry: {
            title: "Could not save diary entry",
            message:
                "Something went wrong while saving your diary entry.",
        },

        diaryEntryNotFound: {
            title: "Diary entry not found",
            message: "This diary entry could not be found.",
        },

        couldNotLoadDiaryEntry: {
            title: "Could not load diary entry",
            message:
                "Something went wrong while loading the diary entry.",
        },

        couldNotSaveDiaryEntryChanges: {
            title: "Could not save diary entry",
            message:
                "Something went wrong while saving your changes.",
        },

        couldNotDeleteDiaryEntry: {
            title: "Could not delete diary entry",
            message:
                "Something went wrong while deleting the entry.",
        },

        invalidAmount: {
            title: "Invalid amount",
            message: "Please enter an amount greater than zero.",
        },

        missingCurrency: {
            title: "Missing currency",
            message: "Please enter a currency.",
        },

        missingDate: {
            title: "Missing date",
            message: "Please enter a date.",
        },

        couldNotSaveExpense: {
            title: "Could not save expense",
            message: "Something went wrong while saving the expense.",
        },

        couldNotDeleteExpense: {
            title: "Could not delete expense",
            message: "Something went wrong while deleting the expense.",
        },
    }
};