import { KalenderEvents } from "kalender-events"
import { IcalEventsConfig } from "./ical-config";

module.exports = async (icalConfig: IcalEventsConfig) => {
  try {
    const kalenderEvents = new KalenderEvents()
    const data = await kalenderEvents.getEvents(icalConfig);
    return JSON.stringify(data)
  }
  catch (err) {
    console.log(err);
    return {
      err
    }
  }
};


