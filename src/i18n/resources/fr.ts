import { en } from "./en";

export const fr = {
    adventures: {
        adventure: "aventure",
        adventures: "aventures",

        // Common
        editAdventure: "modifier l'aventure",
        adventureSystem: "système d'aventure",
        newAdventure: "Nouvelle aventure",
        detailsAdventure: "détails de l'aventure",

        // Main screen
        activeAdventureTitle: "Aventure en cours",
        noActiveAdventure: "Aucune aventure en cours",
        noActiveAdventureDesc:
            "Vous êtes actuellement entre deux aventures.",

        upcomingAdventureTitle: "Prochaine aventure",
        noUpcomingAdventure: "Aucune prochaine aventure",
        noUpcomingAdventureDesc:
            "Vous n'avez aucune aventure à venir. Place à la préparation !",

        pastAdventureTitle: "Aventure passée",
        noPastAdventure: "Aucune aventure passée",
        noPastAdventureDesc:
            "Vous n'avez aucune aventure passée. Il est temps de partir !",

        // Details screen
        loadingAdventure: "Chargement de l'aventure...",

        notFound: "Aventure introuvable",
        notFoundDesc: "Impossible de charger cette aventure.",

        statAdventure: "de l'aventure",

        subHeader: "Briefing de mission",
        scheduleSectionTitle: "Programme",

        noDays: "Aucune journée planifiée",
        noDaysDesc:
            "Vous n'avez encore rien planifié pour cette aventure. Ajoutez une première journée pour commencer.",

        offlineMapDesc:
            "Téléchargez les données cartographiques avant de sortir de la zone couverte.",

        // Edit screen
        currentAdventure: "aventure actuelle",
        adventureTitle: "titre de l'aventure",

        adventureDesc: "Décrivez cette aventure...",

        delDesc:
            "Supprimez définitivement cette aventure et toutes les données associées.",
        delAdventure: "SUPPRIMER L'AVENTURE",
        delAdventureDesc:
            "Cette aventure ainsi que ses journées planifiées, ses POI et toutes les autres données associées seront définitivement supprimés. Cette action est irréversible.",

        // Create screen
        planJourney: "planifiez votre prochaine aventure",
        planJourneyDesc:
            "Définissez les bases maintenant. Vous pourrez ajouter des journées, des itinéraires, des points d'intérêt et des entrées de journal plus tard.",
        defaultAdventure: "Voyage à vélo",
        descPlaceholder: "Quelques mots sur cette aventure...",
        beginPlanning: "COMMENCER LA PLANIFICATION",
        createAdventure: "CRÉER L'AVENTURE",
    },

    finance: {
        finances: "finances",
        budget: "budget",
        expenses: "dépenses",
        remaining: "restant",
        adventureFinance: "FINANCES DE L'AVENTURE",
        finance: "FINANCES",

        conversionNotice: (count: number) =>
            `${count} dépense${count === 1 ? "" : "s"} en attente d'un taux de change.`,

        adventureLog: "JOURNAL DES DÉPENSES",
        recentExpenses: "DÉPENSES RÉCENTES",
        noExpenses: "AUCUNE DÉPENSE",
        noExpensesMessage:
            "Les dépenses de votre aventure apparaîtront ici.",

        addExpense: "AJOUTER UNE DÉPENSE",

        editExpense: "MODIFIER LA DÉPENSE",

        amount: "MONTANT",
        amountLabel: "Montant",
        amountPlaceholder: "0,00",

        currency: "Devise",

        category: "CATÉGORIE",

        details: "DÉTAILS",
        description: "Description",
        descriptionPlaceholder: "À quoi cette dépense correspond-elle ?",
        date: "Date",
        datePlaceholder: "2026-08-29",

        saveChanges: "ENREGISTRER LES MODIFICATIONS",
        deleteExpense: "SUPPRIMER LA DÉPENSE",

        categories: {
            food: "Nourriture",
            transport: "Transport",
            accommodation: "Hébergement",
            gear: "Équipement",
            other: "Autre",
        },

        deleteConfirmation: {
            title: "Supprimer la dépense ?",
            message: "Cette dépense sera définitivement supprimée.",
            cancel: "Annuler",
            confirm: "Supprimer",
        },

        loadingExpense: "CHARGEMENT DE LA DÉPENSE...",
        newExpense: "NOUVELLE DÉPENSE",
        saveExpense: "ENREGISTRER LA DÉPENSE",
    },

    maps: {
        map: "carte",
        maps: "cartes",
        offlineMaps: "cartes hors ligne",

        downloadingMaps: "téléchargement des cartes...",
        downloadMaps: "télécharger les cartes",
    },

    diary: {
        diary: "journal",
        back: "RETOUR",
        newEntry: "NOUVELLE ENTRÉE",

        date: "DATE",
        entryDate: "DATE DE L'ENTRÉE",

        entry: "ENTRÉE",
        title: "Titre",
        titlePlaceholder: "Une journée qui mérite d'être racontée",

        story: "Récit",
        optional: "FACULTATIF",
        storyPlaceholder: "Que s'est-il passé aujourd'hui ?",

        photos: "PHOTOS",
        addPhoto: "AJOUTER UNE PHOTO",
        photoCount: (count: number) =>
            `${count}/3 photo${count === 1 ? "" : "s"}`,

        saving: "ENREGISTREMENT...",
        saveEntry: "ENREGISTRER L'ENTRÉE",

        loadingAdventure: "Chargement de l'aventure...",
        adventureNotFound:
            "L'aventure sélectionnée est introuvable.",

        loading: "Chargement du journal...",

        somethingWentWrong: "UNE ERREUR EST SURVENUE",

        memories: "SOUVENIRS",
        intro:
            "Revivez les journées, les lieux et les moments qui ont rendu chaque aventure unique.",

        yourAdventures: "VOS AVENTURES",

        noAdventuresYet: "AUCUNE AVENTURE",
        noAdventuresMessage:
            "Créez d'abord une aventure et vos souvenirs apparaîtront ici.",

        editEntry: "MODIFIER L'ENTRÉE",

        saveChanges: "ENREGISTRER LES MODIFICATIONS",
        deleteEntry: "SUPPRIMER L'ENTRÉE",

        deleteConfirmation: {
            title: "Supprimer l'entrée ?",
            message: "Ce souvenir sera définitivement supprimé.",
            cancel: "Annuler",
            confirm: "Supprimer",
        },
    },

    day: {
        day: "journée",
        days: "journées",
        untitledDay: "JOURNÉE SANS TITRE",

        // Create screen
        adventurePlanner: "PLANIFICATEUR D'AVENTURE",
        planDay: "PLANIFIER LA JOURNÉE",

        details: "DÉTAILS DE LA JOURNÉE",

        title: "TITRE DE LA JOURNÉE",
        titlePlaceholder: "À travers les Ardennes",

        save: "ENREGISTRER LA JOURNÉE",

        // Details screen
        plannedDistance: "DISTANCE PRÉVUE",

        pointsOfInterest: "POINTS D'INTÉRÊT",
        noWaypoints: "AUCUN POINT D'INTÉRÊT",
        nothingPlanned:
            "Rien n'a encore été planifié pour cette journée.",

        addPointOfInterest: "AJOUTER UN POINT D'INTÉRÊT",
        openMap: "OUVRIR LA CARTE",
        downloadOfflineMap: "TÉLÉCHARGER LA CARTE HORS LIGNE",
        loadGPX: "Charger un GPX",
        editDay: "MODIFIER LA JOURNÉE",

        loading: "CHARGEMENT DE LA JOURNÉE...",
        notFound: "JOURNÉE INTROUVABLE",
        unableToLoad:
            "Impossible de charger cette journée.",

        // Edit screen
        date: "DATE",

        planning: "PLANIFICATION",
        distance: "DISTANCE",
        elevation: "DÉNIVELÉ",
        distancePlaceholder: "85",
        elevationPlaceholder: "1200",

        notesSection: "NOTES DE LA JOURNÉE",
        notes: "NOTES",
        notesPlaceholder:
            "Que devez-vous retenir de cette journée ?",

        saveChanges: "ENREGISTRER LES MODIFICATIONS",

        dangerZone: "ZONE DANGEREUSE",
        deleteDay: "SUPPRIMER LA JOURNÉE",
        deleteDescription:
            "Supprimez définitivement cette journée et ses POI.",

        deleteConfirmation: {
            title: "SUPPRIMER LA JOURNÉE ?",
            message:
                "Cette journée et les points d'intérêt que vous avez planifiés seront définitivement supprimés. Cette action est irréversible.",
            confirm: "SUPPRIMER",
            cancel: "GARDER LA JOURNÉE",
        },
    },

    poi: {
        types: {
            food: {
                label: "NOURRITURE",
                description:
                    "Restaurant, café ou étape pour manger",
            },
            water: {
                label: "EAU",
                description:
                    "Source, fontaine ou point de remplissage",
            },
            supermarket: {
                label: "COURSES",
                description:
                    "Provisions et courses",
            },
            accommodation: {
                label: "HÉBERGEMENT",
                description:
                    "Hôtel, camping ou abri",
            },
            other: {
                label: "AUTRE",
                description:
                    "Tout autre endroit qui mérite d'être marqué",
            },
        },

        adventurePlanner: "PLANIFICATEUR D'AVENTURE",
        newPoi: "NOUVEAU POI",

        markWaypoint: "MARQUER UN POINT D'INTÉRÊT",
        introText:
            "Ajoutez quelque chose dont vous voulez vous souvenir le long de votre itinéraire.",

        waypointDetails: "DÉTAILS DU POINT D'INTÉRÊT",
        name: "NOM",
        namePlaceholder: "Café de montagne",
        waypointType: "TYPE DE POINT D'INTÉRÊT",

        type: "TYPE",

        location: "EMPLACEMENT",
        latitude: "LATITUDE",
        latitudePlaceholder: "50.1234",
        longitude: "LONGITUDE",
        longitudePlaceholder: "4.5678",

        locationHint:
            "Les coordonnées sont facultatives. Vous pourrez les ajouter plus tard lorsque l'itinéraire ou la carte sera prêt.",

        notes: "NOTES",
        notesPlaceholder:
            "Que devez-vous retenir de cet endroit ?",

        addToToday: "AJOUTER À AUJOURD'HUI",
        markWaypointButton: "MARQUER LE POINT",

        noDaySelected: "AUCUNE JOURNÉE SÉLECTIONNÉE",
        noDaySelectedMessage:
            "Ce point d'intérêt ne peut pas être créé sans journée.",
        goBack: "RETOUR",

        editPoi: "MODIFIER LE POI",

        locationHintShort: "Les coordonnées sont facultatives.",

        waypointData: "DONNÉES DU POINT D'INTÉRÊT",
        saveChanges: "ENREGISTRER LES MODIFICATIONS",

        dangerZone: "ZONE DANGEREUSE",
        deletePoi: "SUPPRIMER LE POI",
        deleteDescription:
            "Supprimez définitivement ce point d'intérêt.",

        deleteConfirmation: {
            title: "SUPPRIMER LE POI ?",
            message:
                "Ce point d'intérêt sera définitivement supprimé de la journée. Cette action est irréversible.",
            confirm: "SUPPRIMER",
            cancel: "GARDER LE POI",
        },

        loading: "Chargement...",
    },

    time: {
        startDate: "date de début",
        endDate: "date de fin",
        date: "date",
        datePlaceholder: "2026-08-28",
    },

    homeScreen: {
        noAdventure: "Aucune aventure en cours",
        noAdventureDesc:
            "Commencez ou rejoignez une aventure pour débuter votre voyage.",
        currentAdventure: "Aventure actuelle",
        selectAdventure: "Sélectionner une aventure",
        multAdventuresDesc:
            "Vous avez plusieurs aventures actives aujourd'hui.",
        viewAdventures: "Voir les aventures",
        infinity: "À l'infini !",

        restDayTitle: "Jour de repos",
        restDayDesc: "Rien de prévu aujourd'hui.",

        dayPlanner: "Planificateur de journée",
        checkIn: "Pointer",
        addExpense: "Ajouter une dépense",
    },

    dayCard: {
        noTitle: "Journée sans titre",
        today: "Aujourd'hui",
        noPOIDesc:
            "Aucun POI prévu pour aujourd'hui",
    },

    moreScreen: {
        more: "plus",
        title: "Menu",
        subTitle: "Choisissez votre destination",

        adventuresDesc: "Vos aventures",
        financesDesc: "Dépenses effectuées sur la route",
        diaryDesc: "Vos souvenirs de voyage",
        mapsDesc: "Vos cartes téléchargées",

        settings: "Paramètres",
    },

    settings: {
        title: "Paramètres",
        language: "Langue",
        currency: "Devise",
        timeFormat: "Format de l'heure",

        timeFormat24: "24 heures",
        timeFormat12: "12 heures",

        timeFormat24Description: "Exemple : 18:30",
        timeFormat12Description: "Exemple : 18:30",
    },

    common: {
        appName: "Elg Wander",

        home: "Accueil",
        poi: "POI",
        title: "titre",
        description: "description",
        optional: "Facultatif",
        distance: "distance",
        elevation: "dénivelé",

        cancel: "annuler",
        confirm: "confirmer",
        save: "enregistrer",
        delete: "supprimer",
        next: "suivant",
        download: "télécharger",
        dangerZone: "zone dangereuse",

        to: "à",
    },

    units: {
        kmAbr: "km",
        km: "kilomètre",

        mAbr: "m",
        m: "mètre",
    },

    alerts: {
        noInternetConnection: {
            title: "Pas de connexion Internet",
            message:
                "Pour effectuer cette action, veuillez vous connecter à Internet.",
        },

        downloadFailedNoDay: {
            title: "Échec du téléchargement",
            message: "Aucune journée n'a été sélectionnée.",
        },

        noMapData: {
            title: "Aucune donnée cartographique",
            message:
                "Impossible de récupérer les données locales de la carte. Les avez-vous téléchargées ?",
        },

        mapAlreadyDownloaded: {
            title: "Carte déjà téléchargée",
            message:
                "La zone cartographique requise est déjà disponible hors ligne.",
        },

        downloadComplete: {
            title: "Téléchargement terminé",
            message:
                "La carte de cette journée est maintenant disponible hors ligne.",
        },

        downloadFailed: {
            title: "Échec du téléchargement",
            message:
                "La carte hors ligne n'a pas pu être téléchargée.",
        },

        gpxImported: {
            title: "GPX importé",
            message:
                "L'itinéraire a été importé avec succès.",
        },

        importFailed: {
            title: "Échec de l'importation",
            message:
                "Le fichier GPX n'a pas pu être importé.",
        },

        downloadMaps: {
            title: "Télécharger les cartes",
            message:
                "Téléchargez les données cartographiques hors ligne pour chaque journée planifiée. Les zones déjà disponibles hors ligne ne seront pas téléchargées à nouveau.",
        },

        invalidAdventure: {
            title: "Aventure invalide",
        },

        savingAdventureError: {
            title: "Impossible d'enregistrer l'aventure",
            message:
                "L'aventure contient des données invalides.",
        },

        invalidDayChange: {
            title: "Modification de journée invalide",
        },

        couldNotSaveDay: {
            title: "Impossible d'enregistrer la journée",
            fallbackMessage:
                "La journée contient des données invalides.",
        },

        couldNotSavePOI: {
            title: "Impossible d'enregistrer le POI",
            fallbackMessage:
                "Le POI contient des données invalides.",
        },

        invalidPoi: {
            title: "POI invalide",
        },

        photoLimit: {
            title: "Limite de photos",
            message:
                "Une entrée de journal peut contenir jusqu'à trois photos.",
        },

        photoPermissionRequired: {
            title: "Autorisation requise",
            message:
                "Veuillez autoriser l'accès à vos photos pour ajouter des images à votre journal.",
        },

        missingAdventure: {
            title: "Aventure manquante",
            message: "Aucune aventure n'a été spécifiée.",
        },

        adventureUnavailable: {
            title: "Aventure indisponible",
            message:
                "L'aventure sélectionnée est introuvable.",
        },

        missingDiaryTitle: {
            title: "Titre manquant",
            message:
                "Veuillez donner un titre à votre entrée de journal.",
        },

        invalidDiaryDate: {
            title: "Date invalide",
            message:
                "La date de l'entrée doit être comprise dans la période de l'aventure.",
        },

        diaryEntryAlreadyExists: {
            title: "Entrée de journal déjà existante",
            message:
                "Une entrée de journal existe déjà pour cette date. Veuillez choisir une autre date.",
        },

        couldNotSaveDiaryEntry: {
            title: "Impossible d'enregistrer l'entrée",
            message:
                "Une erreur est survenue lors de l'enregistrement de votre entrée de journal.",
        },

        diaryEntryNotFound: {
            title: "Entrée de journal introuvable",
            message:
                "Cette entrée de journal est introuvable.",
        },

        couldNotLoadDiaryEntry: {
            title: "Impossible de charger l'entrée",
            message:
                "Une erreur est survenue lors du chargement de l'entrée de journal.",
        },

        couldNotSaveDiaryEntryChanges: {
            title: "Impossible d'enregistrer l'entrée",
            message:
                "Une erreur est survenue lors de l'enregistrement de vos modifications.",
        },

        couldNotDeleteDiaryEntry: {
            title: "Impossible de supprimer l'entrée",
            message:
                "Une erreur est survenue lors de la suppression de l'entrée.",
        },

        invalidAmount: {
            title: "Montant invalide",
            message:
                "Veuillez saisir un montant supérieur à zéro.",
        },

        missingCurrency: {
            title: "Devise manquante",
            message: "Veuillez saisir une devise.",
        },

        missingDate: {
            title: "Date manquante",
            message: "Veuillez saisir une date.",
        },

        couldNotSaveExpense: {
            title: "Impossible d'enregistrer la dépense",
            message:
                "Une erreur est survenue lors de l'enregistrement de la dépense.",
        },

        couldNotDeleteExpense: {
            title: "Impossible de supprimer la dépense",
            message:
                "Une erreur est survenue lors de la suppression de la dépense.",
        },
    },
} satisfies typeof en;