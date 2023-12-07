// You need to include moment-timezone library for this code to work
import moment from 'moment-timezone';

/**This function converts the timezone into the appropriate format of the user's location */
function convertTimeZone(date, targetTimeZone) {
    return moment(date).tz(targetTimeZone).format();
}

// Example usage:
var originalDate = new Date(); // Local time
var timeZoneNewYork = 'America/New_York'; // IANA time zone for New York

var convertedDate = convertTimeZone(originalDate, timeZoneNewYork);
console.log(convertedDate); // Will print the time in New York, considering daylight saving time automatically
