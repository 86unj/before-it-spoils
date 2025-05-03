import React from "react";

export default function RecipeModal({ selectedRecipe, closeModal }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">{selectedRecipe.recipe_name}</h3>

        <strong>Ingredients:</strong>
        <ul className="list-disc ml-6 mb-4">
          {selectedRecipe.ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>

        <strong>Instructions:</strong>
        {Array.isArray(selectedRecipe.instructions) ? (
          <ol className="list-decimal ml-6">
            {selectedRecipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        ) : (
          <p className="ml-6">{selectedRecipe.instructions || "No instructions available"}</p>
        )}

        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50"
          onClick={closeModal}
        >
          ✕
        </button>
      </div>
    </div>
  );
}