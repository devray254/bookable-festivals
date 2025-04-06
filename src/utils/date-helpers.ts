
import { Event } from "@/utils/events/types";

export function separateEventsByDate(allEvents: Event[]) {
  const now = new Date();
  const eatNow = convertToEAT(now);
  eatNow.setHours(0, 0, 0, 0);

  const upcoming: Event[] = [];
  const past: Event[] = [];

  allEvents.forEach(event => {
    const eventDate = new Date(event.date);
    const eatEventDate = convertToEAT(eventDate);
    eatEventDate.setHours(0, 0, 0, 0);

    if (eatEventDate >= eatNow) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  });

  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { upcomingEvents: upcoming, pastEvents: past };
}

export function convertToEAT(date: Date) {
  return date; // In a real app, you might implement timezone conversion logic here
}
