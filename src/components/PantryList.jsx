import React, { useState } from "react";
import "./PantryList.css";

export default function PantryList({ pantry, setPantry }) {
  const getExpirationClass = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays > 7) return "pantry-item-green"; // More than 7 days
    if (diffDays > 3) return "pantry-item-yellow"; // 4-7 days
    if (diffDays > 0) return "pantry-item-orange"; // 1-3 days
    return "pantry-item-yellow"; // Expired or today
  };

  const removeIngredient = async (item) => {
    try {
        const res = await fetch("https://gdsc-server-fy70.onrender.com/pantry/delete", {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredient: item }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Failed to delete item:", errorData.error);
            return;
        }

        // Update the pantry state after successful deletion
        setPantry((prevPantry) => prevPantry.filter((i) => i.name !== item));
    } catch (err) {
        console.error("Failed to delete pantry item:", err.message);
    }
  };

  return (
    <div className="container text-black">
      <div className="flex flex-wrap">
        {pantry.map((item, i) => (
          <div
            key={i}
            className={`pantry-item ${item.color}`}
          >
            <div className="item-content">
              {item.name}
            </div>
            <button
              onClick={() => removeIngredient(item.name)}
              className="delete-btn font-bold pl-3 text-xs"
              aria-label={`Remove ${item.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}