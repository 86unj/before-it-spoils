import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PantryList from "../components/PantryList";
import RecipeList from "../components/RecipeList";
import OCRUploader from "../components/OCRUploader";
import RecipeModal from "../components/RecipeModal";
import "./Home.css";

export default function Home() {
    const [input, setInput] = useState("");
    const [pantry, setPantry] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const fetchPantry = async () => {
            try {
                const userId = localStorage.getItem("user_id");
                console.log("User ID:", userId); // Debugging line
                const res = await fetch("https://gdsc-server-fy70.onrender.com/pantry", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) throw new Error("Failed to fetch pantry items");
                const data = await res.json();
                setPantry(data.pantry_items || data.pantry || []);
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchPantry();
    }, []);

    const addIngredient = async () => {
        const newItems = input
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter((item) => item);

        const uniqueNewItems = newItems.filter(
            (item) => !pantry.some((pantryItem) => pantryItem.name === item)
        );

        // Update the pantry state with the correct structure
        setPantry([...pantry, ...uniqueNewItems.map((item) => ({ name: item }))]);
        setInput("");

        try {
            const res = await fetch("https://gdsc-server-fy70.onrender.com/pantry/add", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredient: uniqueNewItems }), // Send as a list
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Failed to add items:", errorData.error);
            }
        } catch (err) {
            console.error("Failed to add pantry items:", err.message);
        }
    };

    const removeIngredient = (item) => {
        setPantry(pantry.filter((i) => i !== item));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://gdsc-server-fy70.onrender.com/generate", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredient : pantry }),
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
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">BeforeItSpoils</h1>
                <p className="text-base text-gray-500">Turn your pantry items into delicious recipes!</p>
                {localStorage.getItem("user_id") ? (
                    <p className="text-sm text-gray-500 mt-2">
                        Welcome back! {" "}
                        <button
                            onClick={() => {
                                localStorage.removeItem("user_id"); // Clear user_id from localStorage
                                window.location.reload(); // Reload the page to reflect the sign-out
                            }}
                            className="text-blue-500 hover:underline mt-2"
                        >
                            Sign Out
                        </button>
                    </p>
                ) : (
                    <p className="text-sm text-gray-500 mt-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Login here
                        </Link>
                    </p>
                )}
            </div>

            <div className="fridge-shelves">
                <div className="shelf">
                    <div className="shelf-handle"></div>
                    <PantryList pantry={pantry} setPantry={setPantry} removeIngredient={removeIngredient} />
                </div>
                <div className="shelf">
                    <div className="shelf-handle"></div>
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
                <h2 className="text-lg font-bold mb-4 text-gray-500">Add Ingredients</h2>
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