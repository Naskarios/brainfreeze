import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Temperatures from "./components/TemperaturesList";
import TemperaturesTable from "./components/TemperaturesTable";
import SingleTemperature from "./components/SingleTemperature";
import { ApiContext } from "./contexts/ApiContext";

function App() {
  const [renderList, setRenderList] = useState(false);
  const [renderTable, setRenderTable] = useState(true);
  const [renderSingle, setRenderSingle] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-300">
      {/* serve -s build */}
      {/* HEADER */}
      <Header></Header>
      <div className="flex">
        <button
          onClick={() => {
            setRenderList(!renderList);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          History
        </button>
        <button
          onClick={() => {
            setRenderTable(!renderTable);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          Main Table
        </button>
        <button
          onClick={() => {
            setRenderSingle(!renderSingle);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          Single Temperature
        </button>
      </div>
      {/* Data components */}
      <ApiContext.Provider value="http://localhost:3000">
        {renderTable && (
          <TemperaturesTable
            setRenderTable={setRenderTable}
          ></TemperaturesTable>
        )}
        {renderList && (
          <Temperatures setRenderList={setRenderList}></Temperatures>
        )}
        {renderSingle && <SingleTemperature></SingleTemperature>}
      </ApiContext.Provider>
      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}

export default App;
