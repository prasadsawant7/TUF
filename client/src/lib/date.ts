export function formatISODate(isoDate: string) {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  const formattedDateTime =
    day +
    "/" +
    month +
    "/" +
    year +
    ", " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    "." +
    milliseconds;

  return formattedDateTime;
}
