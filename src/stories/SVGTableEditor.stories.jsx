import { useState } from "react";
import SVGTableEditor from "../components/SVGTableEditor";
import { dataMock } from "../data-mock";

export const Editor = () => {
  const width = 918;
  const height = 1188;

  const [tableCopy, setTableCopy] = useState({
    verticalLines: dataMock.verticalLines,
    horizontalLines: dataMock.horizontalLines,
  });

  return (
    <SVGTableEditor
      width={width}
      height={height}
      horizontalLines={tableCopy.horizontalLines}
      verticalLines={tableCopy.verticalLines}
      boundingPoly={dataMock.boundingPoly}
      onLinesUpdate={(vertical, horizontal) =>
        setTableCopy({
          verticalLines: vertical,
          horizontalLines: horizontal,
        })
      }
    />
  );
};
