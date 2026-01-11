interface TemperaturesTableProps {
  setRenderTable: (check: boolean) => void;
}

function TemperaturesTable({ setRenderTable }: TemperaturesTableProps) {
  return (
    <div>
      <p className="text-white">TemperaturesTable</p>
      <button
        onClick={() => {
          setRenderTable(false);
        }}
        className="ml-4 px-1  bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md "
      >
        X
      </button>
    </div>
  );
}

export default TemperaturesTable;
