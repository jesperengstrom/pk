if (typeof links === 'undefined') {
    links = {};
    links.locales = {};
} else if (typeof links.locales === 'undefined') {
    links.locales = {};
}

// English ===================================================
links.locales['en'] = {
    'MONTHS': ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    'MONTHS_SHORT': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    'DAYS': ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    'DAYS_SHORT': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    'ZOOM_IN': "Zoom in",
    'ZOOM_OUT': "Zoom out",
    'MOVE_LEFT': "Move left",
    'MOVE_RIGHT': "Move right",
    'NEW': "New",
    'CREATE_NEW_EVENT': "Create new event"
};

links.locales['en_US'] = links.locales['en'];
links.locales['en_UK'] = links.locales['en'];

// Swedish ===================================================
links.locales['se'] = {
    'MONTHS': ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
    'MONTHS_SHORT': ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
    'DAYS': ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"],
    'DAYS_SHORT': ["sön", "mån", "tis", "ons", "tor", "fre", "lör"],
    'ZOOM_IN': "Zooma in",
    'ZOOM_OUT': "Zooma out",
    'MOVE_LEFT': "Flytta till vänster",
    'MOVE_RIGHT': "Flytta till höger",
    'NEW': "New",
    'CREATE_NEW_EVENT': "Skapa ny händelse"
};

links.locales['se_SE'] = links.locales['se'];