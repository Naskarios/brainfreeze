import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import type { TemperatureData } from "../types/fridge";
import { differenceInDays, differenceInHours } from "date-fns";

interface TemperaturesTableProps {
  setRenderTable: (check: boolean) => void;
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

function TemperaturesTable({ setRenderTable }: TemperaturesTableProps) {
  const [data, setData] = useState<TemperatureData[] | null>(null);
  const api = useContext(ApiContext);
  const lowTemp = ["15", "16", "13", "10"];
  useEffect(() => {
    const sensors = [
      1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
      23,
    ];
    const fetchData = async () => {
      const url = api + `/api/view-array?sensorIDs=${sensors.join(",")}`;
      const response = await fetch(url, {
        method: "GET",
      });
      const fetchedData = await response.json();
      console.log(fetchedData);
      setData(fetchedData);
    };
    fetchData();
  }, [api]);
  if (!data) {
    return (
      <>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading temperature data...</p>
        </div>
      </>
    );
  }
  const arrayTags = data
    .filter((item) => item !== null)
    .sort((a, b) => {
      if (!a.sensorID || !b.sensorID) return 0;
      return parseInt(a.sensorID) - parseInt(b.sensorID);
    })
    .map((item, index) => (
      // const type

      <tr
        key={index}
        // ++++++PANTA BAZOUME KENO PRIN IN LINE IF******
        //alliws tha yparxei syntaktiko lathos stin css
        // kai the rwtame to ai xwris logo
        className={
          "border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150 " +
          (checkTypeAndTemp(item, lowTemp) ? "bg-green-400" : "bg-red-400") +
          " " +
          (checkOffline(item) ? "bg-pink-500" : "")
        }
      >
        <td className="px-6 py-4 text-gray-700">{item?.sensorID}</td>
        <td className="px-6 py-4 text-blue-600 font-semibold">
          {item?.temperature}°C
        </td>
        <td className="px-6 py-4 text-gray-600">
          {item?.timestamp ? new Date(item.timestamp).toLocaleString() : "N/A"}
        </td>
      </tr>
    ));

  return (
    <div className="p-6">
      <div className="text-2xl font-bold text-white mb-6">
        Temperature Details
        <button
          onClick={() => {
            setRenderTable(false);
          }}
          className="ml-4 px-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
        >
          X
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-6 py-3 text-left font-semibold">Sensor ID</th>
              <th className="px-6 py-3 text-left font-semibold">
                Temperature (°C)
              </th>
              <th className="px-6 py-3 text-left font-semibold">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>{arrayTags}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TemperaturesTable;
