import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import type { TemperatureData } from "../types/fridge";
import { differenceInDays, differenceInHours } from "date-fns";

export default function QuickTable() {
  const [data, setData] = useState<TemperatureData[] | null>(null);
  const api = useContext(ApiContext);
  const lowTemp = ["15", "16", "13", "10"];
  const sensors = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23,
  ];
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const filteredData = data
    .filter((item) => item !== null)
    .sort((a, b) => {
      if (!a.sensorID || !b.sensorID) return 0;
      return parseInt(a.sensorID) - parseInt(b.sensorID);
    });

  // Create a map of sensor data for quick lookup
  const sensorDataMap = new Map<string, TemperatureData>();
  filteredData.forEach((item) => {
    sensorDataMap.set(item.sensorID, item);
  });

  function checkOffline(item: TemperatureData) {
    const hours = Math.abs(
      differenceInHours(new Date(item.timestamp), new Date())
    );
    const days = Math.abs(
      differenceInDays(new Date(item.timestamp), new Date())
    );
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

  function getCardColor(
    item: TemperatureData | undefined,
    lowTemp: string[]
  ): string {
    if (!item) {
      return "bg-gray-300 border-gray-400";
    }
    if (checkOffline(item)) {
      return "bg-yellow-400 border-yellow-600";
    }
    return checkTypeAndTemp(item, lowTemp)
      ? "bg-teal-200 border-teal-400"
      : "bg-rose-400 border-rose-600";
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Temperature Overview
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {sensors.length} sensors monitored
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sensors.map((sensorID) => {
          const item = sensorDataMap.get(String(sensorID));
          return (
            <div
              key={sensorID}
              className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-lg border-2 transition-transform duration-200 hover:scale-105 cursor-default ${getCardColor(
                item,
                lowTemp
              )}`}
            >
              <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Sensor {sensorID}
              </div>
              <div className="text-3xl font-bold text-gray-900 mt-3">
                {item ? `${item.temperature}°C` : "??"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
