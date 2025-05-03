import React, { useState, useEffect } from "react";
import PantryList from "../components/PantryList";
import RecipeList from "../components/RecipeList";
import OCRUploader from "../components/OCRUploader";
import RecipeModal from "../components/RecipeModal";
import "./Home.css"; // Import the fridge-specific styles

export default function Home() {
    const [input, setInput] = useState("");
    const [pantry, setPantry] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const fetchPantry = async () => {
            try {
                const res = await fetch("https://gdsc-server-fy70.onrender.com/pantry/list");
                if (!res.ok) throw new Error("Failed to fetch pantry items");
                const data = await res.json();
                setPantry(data.pantry);
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchPantry();
    }, []);

    const addIngredient = () => {
        const newItems = input
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter((item) => item);
        const uniqueNewItems = newItems.filter((item) => !pantry.includes(item));
        setPantry([...pantry, ...uniqueNewItems]);
        setInput("");
    };

    const removeIngredient = (item) => {
        setPantry(pantry.filter((i) => i !== item));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://gdsc-server-fy70.onrender.com/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients: pantry }),
            });
            if (!res.ok) throw new Error("Something went wrong with the API");
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            setRecipes([{ recipe_name: "Error", instructions: [err.message] }]);
        }
        setLoading(false);
    };

    return (
        <div className="fridge-container">
            <div className="fridge-header">
                <h1 className="fridge-title">TasteBeforeWaste</h1>
                <p className="fridge-description">Turn your pantry items into delicious recipes!</p>
            </div>

            <div className="fridge-shelves">
                <div className="shelf">
                    <PantryList pantry={pantry} removeIngredient={removeIngredient} />
                </div>
                <div className="shelf">
                    <RecipeList
                        recipes={recipes}
                        setSelectedRecipe={setSelectedRecipe}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        pantry={pantry}
                    />
                </div>
            </div>

            <div className="text-center mt-4">
                <div className="flex justify-center gap-2 mb-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. chicken, spinach, milk"
                        className="input input-bordered bg-gray-200"
                    />
                    <button
                        onClick={addIngredient}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : "Add"}
                    </button>
                </div>

                <OCRUploader setPantry={setPantry} />
            </div>

            {selectedRecipe && (
                <RecipeModal
                    selectedRecipe={selectedRecipe}
                    closeModal={() => setSelectedRecipe(null)}
                />
            )}
        </div>
    );
}