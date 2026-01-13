import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import type { TemperatureData } from "../types/fridge";

interface TemperaturesTableProps {
  setRenderTable: (check: boolean) => void;
}

function TemperaturesTable({ setRenderTable }: TemperaturesTableProps) {
  const [data, setData] = useState<TemperatureData>();
  const api = useContext(ApiContext);

  useEffect(() => {
    const fetchData = async () => {
      const url = api + "/api/view-single/7";
      const response = await fetch(url, {
        method: "GET",
      });
      const fetchedData = await response.json();
      console.log(fetchedData);
      setData(fetchedData);
    };
    fetchData();
  }, [api]);
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

      {data ? (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                Node ID
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.nodeID}
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                Temperature
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {data.temperature}°C
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                Last Updated
              </p>
              <p className="text-lg text-gray-700 mt-1">
                {new Date(data.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading temperature data...</p>
        </div>
      )}
    </div>
  );
}

export default TemperaturesTable;
