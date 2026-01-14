import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import type { TemperatureData } from "../types/fridge";

interface TemperaturesTableProps {
  setRenderTable: (check: boolean) => void;
}

function TemperaturesTable({ setRenderTable }: TemperaturesTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<TemperatureData>();
  const api = useContext(ApiContext);

  useEffect(() => {
    const fetchData = async () => {
      const url = api + "/api/view-single/1";
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
    </div>
  );
}

export default TemperaturesTable;
