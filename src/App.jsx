import { useState } from "react";
import SVGTableEditor from "./components/SVGTableEditor";
import { dataMock } from "./data-mock";
import ContextMenu from "./components/ContextMenu";

function App() {
  const [tableCopy, setTableCopy] = useState({
    verticalLines: [],
    horizontalLines: [],
  });
  const width = 918;
  const height = 1188;
  const tableData = dataMock;

  console.info({ tableCopy });

  // return <SVGTable width={width} height={height} data={tableData} />;
  return (
    <>
      <ContextMenu
        options={["Option 1", "Option 2", "Option 3"]}
        onSelect={(option) => console.log("Selected option:", option)}
      >
        <SVGTableEditor
          width={width}
          height={height}
          horizontalLines={tableData.horizontalLines}
          verticalLines={tableData.verticalLines}
          boundingPoly={tableData.boundingPoly}
          onLinesUpdate={(vertical, horizontal) =>
            setTableCopy({
              verticalLines: vertical,
              horizontalLines: horizontal,
            })
          }
        />
      </ContextMenu>
      {tableCopy.horizontalLines.length > 0 &&
      tableCopy.verticalLines.length > 0 ? (
        <SVGTableEditor
          width={width}
          height={height}
          horizontalLines={tableCopy.horizontalLines}
          verticalLines={tableCopy.verticalLines}
          boundingPoly={tableData.boundingPoly}
          onLinesUpdate={(f) => {
            f;
          }}
        />
      ) : null}
    </>
  );
}

export default App;
