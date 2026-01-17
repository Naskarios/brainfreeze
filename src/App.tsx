import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Temperatures from "./components/TemperaturesList";
import TemperaturesTable from "./components/TemperaturesTable";
import SingleTemperature from "./components/SingleTemperature";
import { ApiContext } from "./contexts/ApiContext";
import QuickTable from "./components/QuickTable";

const Render = {
  QUICK: "QUICK",
  LIST: "LIST",
  SINGLE: "SINGLE",
  HISTORY: "HISTORY",
  TABLE: "TABLE",
} as const;

type Render = (typeof Render)[keyof typeof Render];
function App() {
  const [renderSelected, setRender] = useState<Render>(Render.QUICK);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-300">
      {/* serve -s build */}
      {/* HEADER */}
      <Header></Header>
      <div className="flex">
        <button
          onClick={() => {
            setRender(Render.QUICK);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          Quick Info
        </button>
        <button
          onClick={() => {
            setRender(Render.TABLE);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          Main Table
        </button>
        <button
          onClick={() => {
            setRender(Render.SINGLE);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          Single Temperature
        </button>

        <button
          onClick={() => {
            setRender(Render.HISTORY);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          History
        </button>
      </div>
      {/* Data components */}
      <ApiContext.Provider value="http://localhost:3000">
        {renderSelected == Render.TABLE && (
          <TemperaturesTable></TemperaturesTable>
        )}
        {renderSelected == Render.HISTORY && <Temperatures></Temperatures>}
        {renderSelected == Render.SINGLE && (
          <SingleTemperature></SingleTemperature>
        )}

        {renderSelected == Render.QUICK && <QuickTable></QuickTable>}
      </ApiContext.Provider>
      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}

export default App;
