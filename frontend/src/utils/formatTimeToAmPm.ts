export function formatTimeToAmPm(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format hours to 12-hour clock
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  const amPm = hours >= 12 ? "PM" : "AM";

  // Pad minutes with leading zero if necessary
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}
