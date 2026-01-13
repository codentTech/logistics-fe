export const formatDate = (dateString) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateObj = new Date(dateString);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const month = months[monthIndex];
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
};

export const formatDateBySplit = (date) => {
  if (!date) return "Invalid date";
  return date.split("T")[0];
};
