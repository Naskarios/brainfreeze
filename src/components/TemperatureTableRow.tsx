import { checkOffline, checkTypeAndTemp } from "../helpers/helpers";
import type { TemperatureData } from "../types/fridge";

interface TemperatureTableRowProps {
  item: TemperatureData;
  lowTemp: string[];
  detailed: boolean;
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
