import React, { useContext, useEffect, useState } from "react";
import type { TemperatureData } from "../types/fridge";
import { ApiContext } from "../contexts/ApiContext";

export default function SingleTemperature() {
  const [data, setData] = useState<TemperatureData>();
  const [selectedNode, setSelectedNode] = useState<string>("1");
  const api = useContext(ApiContext);
  useEffect(() => {
    const fetchData = async (selectedNode: string) => {
      const url = api + "/api/view-single/" + selectedNode;
      const response = await fetch(url, {
        method: "GET",
      });
      const fetchedData = await response.json();
      console.log(fetchedData);
      setData(fetchedData);
    };
    fetchData(selectedNode);
  }, [api, selectedNode]);

  return (
    <div className="flex flex-col items-center gap-4 my-6">
      <label className="text-white text-lg font-semibold">What node sir?</label>
      <input
        type="number"
        onChange={(e) => {
          setSelectedNode(e.target.value);
        }}
        placeholder="Enter node number"
        className="px-4 py-2 rounded-lg border-2 bg-white border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
      />
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
