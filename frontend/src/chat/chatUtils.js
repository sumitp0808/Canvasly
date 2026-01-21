export const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDate = (ts) =>
  new Date(ts).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const isSameDay = (a, b) =>
  new Date(a).toDateString() === new Date(b).toDateString();
