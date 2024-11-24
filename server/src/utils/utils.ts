import logger from "../config/logger.ts";

export const stringToBoolean = (string: string): boolean | undefined => {
  // return string.toLocaleLowerCase() === 'true' ? true
  //         : string.toLocaleLowerCase() === 'false' ? false
  //         : undefined;
  switch (string.toLowerCase()) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      logger.warn(`Invalid boolean string: ${string}`);
      return undefined;
  }
};

export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getRandomString = (length: number) => {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
  let string = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * alphabets.length);
    string += alphabets[index];
  }
  return string;
};
