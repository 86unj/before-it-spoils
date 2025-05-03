import React from "react";
import "./RecipeList.css";

export default function RecipeList({ recipes, setSelectedRecipe, handleSubmit, loading, pantry }) {
    return (
        <div>
            <div className="text-center text-gray-800">Suggested Recipes</div>
            {recipes.length === 0 && <div className="text-center text-gray-500 mt-3">No Recipe Yet</div>}

            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {recipes.map((recipe, index) => (
                    <div
                        key={index}
                        className="card sticky-note"
                        onClick={() => setSelectedRecipe(recipe)}
                    >
                        <h4>{recipe.recipe_name}</h4>
                    </div>
                ))}
            </div>

            <div className="text-center mt-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading || pantry.length === 0}
                    className="btn btn-secondary"
                >
                    {loading ? "Generating Recipes..." : "Generate Recipes"}
                </button>
            </div>
        </div>
    );
}