import SVGTableEditor from "./components/SVGTableEditor";
import { dataMock } from "./data-mock";

function App() {
  const width = 918;
  const height = 1188;
  const tableData = dataMock;

  // return <SVGTable width={width} height={height} data={tableData} />;
  return (
    <SVGTableEditor
      width={width}
      height={height}
      horizontalLines={tableData.horizontalLines}
      verticalLines={tableData.verticalLines}
      boundingPoly={tableData.boundingPoly}
    />
  );
}

export default App;
