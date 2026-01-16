import type { TemperatureData } from "../types/fridge";
import { differenceInDays, differenceInHours } from "date-fns";

interface TemperatureTableRowProps {
  item: TemperatureData;
  lowTemp: string[];
  detailed: boolean;
}

function checkOffline(item: TemperatureData) {
  const hours = Math.abs(
    differenceInHours(new Date(item.timestamp), new Date())
  );
  const days = Math.abs(differenceInDays(new Date(item.timestamp), new Date()));

  return hours > 2 && days < 7;
}

function checkTypeAndTemp(t: TemperatureData, lowTemp: string[]) {
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

function TemperatureTableRow({
  item,
  lowTemp,
  detailed,
}: TemperatureTableRowProps) {
  return (
    <tr
      className={
        "border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150 " +
        (checkTypeAndTemp(item, lowTemp) ? "bg-teal-200" : "bg-rose-400") +
        " " +
        (checkOffline(item) ? "bg-yellow-400" : " ")
      }
    >
      {detailed && (
        <td className="px-6 py-4 text-gray-700">{item?.sensorID}</td>
      )}
      <td className="px-6 py-4 text-blue-600 font-semibold">
        {item?.temperature}°C
      </td>
      {detailed && (
        <td className="px-6 py-4 text-gray-600">
          {item?.timestamp ? new Date(item.timestamp).toLocaleString() : "N/A"}
        </td>
      )}
    </tr>
  );
}

export default TemperatureTableRow;
