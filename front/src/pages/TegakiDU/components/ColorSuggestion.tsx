import React from "react";

export const ColorSuggestion: React.VFC = () => {
  const colorsGrid = [
    ["#000000", "#ffffff", "#a80515", "#f1d0d0", "#4b3d38", "#eae5d5"],
    ["#384b43", "#cfeadd", "#313768", "#d5e9f3", "#800000", "#f0e0d6"],
  ];
  return (
    <div>
      <p>↓おすすめの色ですカラーピッカー使ってください</p>
      {colorsGrid.map((colors, i) => (
        <div key={i} className="d-flex justify-content-around">
          {colors.map((color, j) => (
            <div>
              <div
                key={j}
                className="p-2 d-inline-block border border-dark"
                style={{ width: 64, height: 64, backgroundColor: color }}
              ></div>
              <div>{color}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
