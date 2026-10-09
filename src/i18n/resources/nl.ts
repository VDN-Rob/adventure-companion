import { en } from "./en";

export const nl = {
    adventures: {
        adventure: "avontuur",
        adventures: "avonturen",

        editAdventure: "avontuur bewerken",
        adventureSystem: "avonturensysteem",
        newAdventure: "Nieuw avontuur",
        detailsAdventure: "avontuurdetails",

        activeAdventureTitle: "Lopend avontuur",
        noActiveAdventure: "Geen lopend avontuur",
        noActiveAdventureDesc:
            "Je bevindt je momenteel tussen twee avonturen.",

        upcomingAdventureTitle: "Aankomend avontuur",
        noUpcomingAdventure: "Geen aankomend avontuur",
        noUpcomingAdventureDesc:
            "Je hebt geen geplande avonturen. Tijd om te plannen!",

        pastAdventureTitle: "Voorbije avonturen",
        noPastAdventure: "Geen voorbije avonturen",
        noPastAdventureDesc:
            "Je hebt geen voorbije avonturen. Tijd om eropuit te trekken!",

        loadingAdventure: "Avontuur laden...",

        notFound: "Avontuur niet gevonden",
        notFoundDesc: "Kan dit avontuur niet laden.",

        statAdventure: "van het avontuur",

        subHeader: "Missiebriefing",
        scheduleSectionTitle: "Planning",

        noDays: "Geen dagen gepland",
        noDaysDesc:
            "Je hebt nog niets gepland voor dit avontuur. Voeg de eerste dag toe om te beginnen.",

        offlineMapDesc:
            "Download kaartgegevens voordat je buiten het bereik komt.",

        currentAdventure: "huidig avontuur",
        adventureTitle: "titel van het avontuur",

        adventureDesc: "Beschrijf dit avontuur...",

        delDesc:
            "Verwijder dit avontuur en alle bijbehorende gegevens permanent.",
        delAdventure: "AVONTUUR VERWIJDEREN",
        delAdventureDesc:
            "Dit avontuur en de geplande dagen, POI's en andere gegevens worden permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.",

        planJourney: "plan je volgende reis",
        planJourneyDesc:
            "Leg nu de basis vast. Later kun je dagen, routes, interessante punten en dagboeknotities toevoegen.",
        defaultAdventure: "Fietstocht",
        descPlaceholder: "Een paar woorden over dit avontuur...",
        beginPlanning: "BEGIN MET PLANNEN",
        createAdventure: "AVONTUUR AANMAKEN",
    },

    finance: {
        finances: "financiën",
        budget: "budget",
        expenses: "uitgaven",
        remaining: "resterend",
        adventureFinance: "AVONTUURFINANCIËN",
        finance: "FINANCIËN",

        conversionNotice: (count: number) =>
            `${count} uitgave${count === 1 ? "" : "n"} wacht${count === 1 ? "t" : "en"} op een wisselkoers.`,

        adventureLog: "UITGAVENLOGBOEK",
        recentExpenses: "RECENTE UITGAVEN",
        noExpenses: "GEEN UITGAVEN",
        noExpensesMessage:
            "De uitgaven van je avontuur verschijnen hier.",

        addExpense: "UITGAVE TOEVOEGEN",

        editExpense: "UITGAVE BEWERKEN",

        amount: "BEDRAG",
        amountLabel: "Bedrag",
        amountPlaceholder: "0,00",

        currency: "Valuta",

        category: "CATEGORIE",

        details: "DETAILS",
        description: "Beschrijving",
        descriptionPlaceholder:
            "Waar heb je dit aan uitgegeven?",
        date: "Datum",
        datePlaceholder: "2026-08-29",

        saveChanges: "WIJZIGINGEN OPSLAAN",
        deleteExpense: "UITGAVE VERWIJDEREN",

        categories: {
            food: "Eten",
            transport: "Vervoer",
            accommodation: "Overnachting",
            gear: "Uitrusting",
            other: "Overig",
        },

        deleteConfirmation: {
            title: "Uitgave verwijderen?",
            message: "Deze uitgave wordt permanent verwijderd.",
            cancel: "Annuleren",
            confirm: "Verwijderen",
        },

        loadingExpense: "UITGAVE LADEN...",
        newExpense: "NIEUWE UITGAVE",
        saveExpense: "UITGAVE OPSLAAN",
    },

    maps: {
        map: "kaart",
        maps: "kaarten",
        offlineMaps: "offlinekaarten",

        downloadingMaps: "kaarten downloaden...",
        downloadMaps: "kaarten downloaden",
    },

    diary: {
        diary: "dagboek",
        back: "TERUG",
        newEntry: "NIEUWE DAGBOEKNOTITIE",

        date: "DATUM",
        entryDate: "DATUM VAN DE NOTITIE",

        entry: "NOTITIE",
        title: "Titel",
        titlePlaceholder: "Een dag om te onthouden",

        story: "Verhaal",
        optional: "OPTIONEEL",
        storyPlaceholder: "Wat gebeurde er vandaag?",

        photos: "FOTO'S",
        addPhoto: "FOTO TOEVOEGEN",
        photoCount: (count: number) =>
            `${count}/3 foto${count === 1 ? "" : "'s"}`,

        saving: "OPSLAAN...",
        saveEntry: "NOTITIE OPSLAAN",

        loadingAdventure: "Avontuur laden...",
        adventureNotFound:
            "Het geselecteerde avontuur kon niet worden gevonden.",

        loading: "Dagboek laden...",

        somethingWentWrong: "ER IS IETS MISGEGAAN",

        memories: "HERINNERINGEN",
        intro:
            "Herbeleef de dagen, plaatsen en momenten die elk avontuur van jou maakten.",

        yourAdventures: "JOUW AVONTUREN",

        noAdventuresYet: "NOG GEEN AVONTUREN",
        noAdventuresMessage:
            "Maak eerst een avontuur aan en je herinneringen verschijnen hier.",

        editEntry: "DAGBOEKNOTITIE BEWERKEN",

        saveChanges: "WIJZIGINGEN OPSLAAN",
        deleteEntry: "NOTITIE VERWIJDEREN",

        deleteConfirmation: {
            title: "Dagboeknotitie verwijderen?",
            message:
                "Deze herinnering wordt permanent verwijderd.",
            cancel: "Annuleren",
            confirm: "Verwijderen",
        },
    },

    day: {
        day: "dag",
        days: "dagen",
        untitledDay: "DAG ZONDER TITEL",

        adventurePlanner: "AVONTURENPLANNER",
        planDay: "DAG PLANNEN",

        details: "DAGDETAILS",

        title: "TITEL VAN DE DAG",
        titlePlaceholder: "Door de Ardennen",

        save: "DAG OPSLAAN",

        plannedDistance: "GEPLANDE AFSTAND",

        pointsOfInterest: "INTERESSANTE PUNTEN",
        noWaypoints: "GEEN INTERESSANTE PUNTEN",
        nothingPlanned:
            "Er is nog niets gepland voor deze dag.",

        addPointOfInterest: "INTERESSANT PUNT TOEVOEGEN",
        openMap: "KAART OPENEN",
        downloadOfflineMap: "OFFLINEKAART DOWNLOADEN",
        loadGPX: "GPX laden",
        editDay: "DAG BEWERKEN",

        loading: "DAG LADEN...",
        notFound: "DAG NIET GEVONDEN",
        unableToLoad: "Kan deze dag niet laden.",

        date: "DATUM",

        planning: "PLANNING",
        distance: "AFSTAND",
        elevation: "HOOGTEMETERS",
        distancePlaceholder: "85",
        elevationPlaceholder: "1200",

        notesSection: "NOTITIES VAN DE DAG",
        notes: "NOTITIES",
        notesPlaceholder:
            "Wat moet je onthouden over deze dag?",

        saveChanges: "WIJZIGINGEN OPSLAAN",

        dangerZone: "GEVARENZONE",
        deleteDay: "DAG VERWIJDEREN",
        deleteDescription:
            "Verwijder deze dag en de bijbehorende POI's permanent.",

        deleteConfirmation: {
            title: "DAG VERWIJDEREN?",
            message:
                "Deze dag en de geplande interessante punten worden permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.",
            confirm: "VERWIJDEREN",
            cancel: "DAG BEHOUDEN",
        },
    },

    poi: {
        types: {
            food: {
                label: "ETEN",
                description:
                    "Restaurant, café of plek om te eten",
            },
            water: {
                label: "WATER",
                description:
                    "Bron, fontein of tappunt",
            },
            supermarket: {
                label: "WINKEL",
                description:
                    "Voorraad en boodschappen",
            },
            accommodation: {
                label: "VERBLIJF",
                description:
                    "Hotel, camping of schuilplaats",
            },
            other: {
                label: "OVERIG",
                description:
                    "Iets anders dat het markeren waard is",
            },
        },

        adventurePlanner: "AVONTURENPLANNER",
        newPoi: "NIEUWE POI",

        markWaypoint: "MARKEREN ALS INTERESSANT PUNT",
        introText:
            "Voeg iets toe dat je langs je route wilt onthouden.",

        waypointDetails: "DETAILS VAN INTERESSANT PUNT",
        name: "NAAM",
        namePlaceholder: "Bergcafé",
        waypointType: "TYPE INTERESSANT PUNT",

        type: "TYPE",

        location: "LOCATIE",
        latitude: "BREEDTEGRAAD",
        latitudePlaceholder: "50.1234",
        longitude: "LENGTEGRAAD",
        longitudePlaceholder: "4.5678",

        locationHint:
            "Coördinaten zijn optioneel. Je kunt ze later toevoegen wanneer de route of kaart klaar is.",

        notes: "NOTITIES",
        notesPlaceholder:
            "Wat moet je onthouden over deze plek?",

        addToToday: "AAN VANDAAG TOEVOEGEN",
        markWaypointButton: "PUNT MARKEREN",

        noDaySelected: "GEEN DAG GESELECTEERD",
        noDaySelectedMessage:
            "Dit interessante punt kan niet zonder dag worden aangemaakt.",
        goBack: "TERUG",

        editPoi: "POI BEWERKEN",

        locationHintShort: "Coördinaten zijn optioneel.",

        waypointData: "GEGEVENS VAN INTERESSANT PUNT",
        saveChanges: "WIJZIGINGEN OPSLAAN",

        dangerZone: "GEVARENZONE",
        deletePoi: "POI VERWIJDEREN",
        deleteDescription:
            "Verwijder dit interessante punt permanent.",

        deleteConfirmation: {
            title: "POI VERWIJDEREN?",
            message:
                "Dit interessante punt wordt permanent van de dag verwijderd. Deze actie kan niet ongedaan worden gemaakt.",
            confirm: "VERWIJDEREN",
            cancel: "POI BEHOUDEN",
        },

        loading: "Laden...",
    },

    time: {
        startDate: "startdatum",
        endDate: "einddatum",
        date: "datum",
        datePlaceholder: "2026-08-28",
    },

    homeScreen: {
        noAdventure: "Geen lopend avontuur",
        noAdventureDesc: "Start of neem deel aan een avontuur om je reis te beginnen.",
        currentAdventure: "Huidig avontuur",
        selectAdventure: "Avontuur selecteren",
        multAdventuresDesc: "Je hebt vandaag meerdere actieve avonturen.",
        continuePlanning: "Avonturen bekijken",
        infinity: "Tot in het oneindige!",

        restDayTitle: "Rustdag",
        restDayDesc: "Niets gepland voor vandaag.",

        dayPlanner: "Dagplanner",
        checkIn: "Inchecken",
        addExpense: "Uitgave toevoegen",
        createAdventure: "Nieuw avontuur"
    },

    dayCard: {
        noTitle: "Dag zonder titel",
        today: "Vandaag",
        noPOIDesc:
            "Geen POI's gepland voor vandaag",
    },

    moreScreen: {
        more: "meer",
        title: "Menu",
        subTitle: "Kies je bestemming",

        adventuresDesc: "Jouw avonturen",
        financesDesc: "Uitgaven onderweg",
        diaryDesc: "Jouw herinneringen onderweg",
        mapsDesc: "Jouw gedownloade kaarten",

        settings: "Instellingen",
    },

    settings: {
        title: "Instellingen",
        language: "Taal",
        currency: "Valuta",
        timeFormat: "Tijdnotatie",

        timeFormat24: "24-uurs",
        timeFormat12: "12-uurs",

        timeFormat24Description: "Voorbeeld: 18:30",
        timeFormat12Description: "Voorbeeld: 18:30",
    },

    common: {
        appName: "Elg Wander",

        home: "Home",
        poi: "POI",
        title: "titel",
        description: "beschrijving",
        optional: "Optioneel",
        distance: "afstand",
        elevation: "hoogtemeters",

        cancel: "annuleren",
        confirm: "bevestigen",
        save: "opslaan",
        delete: "verwijderen",
        next: "volgende",
        download: "downloaden",
        dangerZone: "gevarenzone",

        to: "tot",
    },

    units: {
        kmAbr: "km",
        km: "kilometer",

        mAbr: "m",
        m: "meter",
    },

    alerts: {
        noInternetConnection: {
            title: "Geen internetverbinding",
            message:
                "Maak verbinding met internet om deze actie uit te voeren.",
        },

        downloadFailedNoDay: {
            title: "Download mislukt",
            message: "Er is geen dag geselecteerd.",
        },

        noMapData: {
            title: "Geen kaartgegevens",
            message:
                "Kan geen lokale kaartgegevens ophalen. Heb je ze gedownload?",
        },

        mapAlreadyDownloaded: {
            title: "Kaart al gedownload",
            message:
                "Het benodigde kaartgebied is al offline beschikbaar.",
        },

        downloadComplete: {
            title: "Download voltooid",
            message:
                "De kaart voor deze dag is nu offline beschikbaar.",
        },

        downloadFailed: {
            title: "Download mislukt",
            message:
                "De offlinekaart kon niet worden gedownload.",
        },

        gpxImported: {
            title: "GPX geïmporteerd",
            message:
                "De route is succesvol geïmporteerd.",
        },

        importFailed: {
            title: "Importeren mislukt",
            message:
                "Het GPX-bestand kon niet worden geïmporteerd.",
        },

        downloadMaps: {
            title: "Kaarten downloaden",
            message:
                "Download offline kaartgegevens voor elke geplande dag. Gebieden die al offline beschikbaar zijn, worden niet opnieuw gedownload.",
        },

        invalidAdventure: {
            title: "Ongeldig avontuur",
        },

        savingAdventureError: {
            title: "Avontuur kon niet worden opgeslagen",
            message:
                "Het avontuur bevat ongeldige gegevens.",
        },

        invalidDayChange: {
            title: "Ongeldige wijziging van de dag",
        },

        couldNotSaveDay: {
            title: "Dag kon niet worden opgeslagen",
            fallbackMessage:
                "De dag bevat ongeldige gegevens.",
        },

        couldNotSavePOI: {
            title: "POI kon niet worden opgeslagen",
            fallbackMessage:
                "De POI bevat ongeldige gegevens.",
        },

        invalidPoi: {
            title: "Ongeldige POI",
        },

        photoLimit: {
            title: "Fotolimiet",
            message:
                "Een dagboeknotitie kan maximaal drie foto's bevatten.",
        },

        photoPermissionRequired: {
            title: "Toestemming vereist",
            message:
                "Geef toegang tot je foto's om afbeeldingen aan je dagboek toe te voegen.",
        },

        missingAdventure: {
            title: "Avontuur ontbreekt",
            message: "Er is geen avontuur opgegeven.",
        },

        adventureUnavailable: {
            title: "Avontuur niet beschikbaar",
            message:
                "Het geselecteerde avontuur kon niet worden gevonden.",
        },

        missingDiaryTitle: {
            title: "Titel ontbreekt",
            message:
                "Geef je dagboeknotitie een titel.",
        },

        invalidDiaryDate: {
            title: "Ongeldige datum",
            message:
                "De datum van de dagboeknotitie moet binnen het avontuur vallen.",
        },

        diaryEntryAlreadyExists: {
            title: "Dagboeknotitie bestaat al",
            message:
                "Er bestaat al een dagboeknotitie voor deze datum. Kies een andere datum.",
        },

        couldNotSaveDiaryEntry: {
            title: "Dagboeknotitie kon niet worden opgeslagen",
            message:
                "Er is iets misgegaan bij het opslaan van je dagboeknotitie.",
        },

        diaryEntryNotFound: {
            title: "Dagboeknotitie niet gevonden",
            message:
                "Deze dagboeknotitie kon niet worden gevonden.",
        },

        couldNotLoadDiaryEntry: {
            title: "Dagboeknotitie kon niet worden geladen",
            message:
                "Er is iets misgegaan bij het laden van de dagboeknotitie.",
        },

        couldNotSaveDiaryEntryChanges: {
            title: "Dagboeknotitie kon niet worden opgeslagen",
            message:
                "Er is iets misgegaan bij het opslaan van je wijzigingen.",
        },

        couldNotDeleteDiaryEntry: {
            title: "Dagboeknotitie kon niet worden verwijderd",
            message:
                "Er is iets misgegaan bij het verwijderen van de notitie.",
        },

        invalidAmount: {
            title: "Ongeldig bedrag",
            message:
                "Voer een bedrag groter dan nul in.",
        },

        missingCurrency: {
            title: "Valuta ontbreekt",
            message: "Voer een valuta in.",
        },

        missingDate: {
            title: "Datum ontbreekt",
            message: "Voer een datum in.",
        },

        couldNotSaveExpense: {
            title: "Uitgave kon niet worden opgeslagen",
            message:
                "Er is iets misgegaan bij het opslaan van de uitgave.",
        },

        couldNotDeleteExpense: {
            title: "Uitgave kon niet worden verwijderd",
            message:
                "Er is iets misgegaan bij het verwijderen van de uitgave.",
        },
    },
} satisfies typeof en;