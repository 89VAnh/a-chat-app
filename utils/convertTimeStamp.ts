export const convertTimeStamp = (timeStamp: any) => {
  if (!timeStamp?.seconds) return "";

  return new Date(timeStamp?.seconds * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
};
