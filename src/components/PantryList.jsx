import React from "react";
import "./PantryList.css";

export default function PantryList({ pantry, removeIngredient }) {
  return (
    <div className="container text-black">
      <div className="flex flex-wrap">
        {pantry.map((item, i) => (
          <div key={i} className="pantry-item">
            {item}
            <button
              onClick={() => removeIngredient(item)}
              className="delete-btn text-red-500 font-bold pl-3"
              aria-label={`Remove ${item}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}