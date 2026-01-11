import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Temperatures from "./components/TemperaturesList";
import TemperaturesTable from "./components/TemperaturesTable";

function App() {
  const [renderList, setRenderList] = useState(true);
  const [renderTable, setRenderTable] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-300">
      {/* serve -s build */}
      <Header></Header>
      <div className="flex">
        <button
          onClick={() => {
            setRenderList(!renderList);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          View List
        </button>{" "}
        <button
          onClick={() => {
            setRenderTable(!renderTable);
          }}
          className="mx-auto my-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          View Table
        </button>
      </div>

      {renderTable && (
        <TemperaturesTable setRenderTable={setRenderTable}></TemperaturesTable>
      )}
      {renderList && (
        <Temperatures setRenderList={setRenderList}></Temperatures>
      )}
      <Footer></Footer>
    </div>
  );
}

export default App;
