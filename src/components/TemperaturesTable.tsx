import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import type { TemperatureData } from "../types/fridge";
import TemperatureTableRow from "./TemperatureTableRow";

function TemperaturesTable() {
  const [data, setData] = useState<TemperatureData[] | null>(null);
  const api = useContext(ApiContext);
  const lowTemp = ["15", "6", "16", "12", "13", "17", "10"];
  const sensors = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 20, 21, 22, 23,
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
  const tableRows = data
    .filter((item) => item !== null)
    .sort((a, b) => {
      if (!a.sensorID || !b.sensorID) return 0;
      return parseInt(a.sensorID) - parseInt(b.sensorID);
    })
    .map((item, index) => (
      <TemperatureTableRow
        key={index}
        item={item}
        lowTemp={lowTemp}
        detailed={true}
      />
    ));

  return (
    <div className="p-6">
      <div className="text-2xl font-bold text-white mb-6">
        Temperature Details
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
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TemperaturesTable;
