import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import type { TemperatureData } from "../types/fridge";

function TemperaturesList() {
  const [data, setData] = useState<TemperatureData[]>([]);
  const api = useContext(ApiContext);

  useEffect(() => {
    const fetchData = async () => {
      const url = api + "/api/view-all";
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
      });
      const fetchedData = await response.json();
      console.log(fetchedData);
      setData(fetchedData);
    };
    fetchData();
  }, [api]);

  const arrayComponent = data.map((a) => {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm text-gray-900">{a.sensorID}</td>
        <td className="px-6 py-4 text-sm text-gray-900">{a.temperature}</td>
        <td className="px-6 py-4 text-sm text-gray-600">{a.timestamp}</td>
      </tr>
    );
  });
  return (
    <div className="p-6">
      <div className="text-2xl font-bold text-white mb-6">
        Temperature History
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-linear-to-r from-blue-500 to-blue-600 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Temperature
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Last Update
              </th>
            </tr>
          </thead>
          <tbody>{arrayComponent}</tbody>
        </table>
      </div>
    </div>
  );
}

export default TemperaturesList;
