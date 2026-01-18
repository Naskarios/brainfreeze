import { differenceInDays, differenceInHours } from "date-fns";
import type { TemperatureData } from "../types/fridge";

export function checkOffline(item: TemperatureData) {
  const hours = Math.abs(
    differenceInHours(new Date(item.timestamp), new Date()),
  );
  const days = Math.abs(differenceInDays(new Date(item.timestamp), new Date()));

  return hours > 4 && days < 7;
}

export function checkTypeAndTemp(t: TemperatureData, lowTemp: string[]) {
  if (lowTemp.includes(t.sensorID) && t.temperature > -18) {
    return false;
  } else if (lowTemp.includes(t.sensorID) && t.temperature < -18) {
    return true;
  } else if (t.temperature > 7) {
    return false;
  } else {
    return true;
  }
}
