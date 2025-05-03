import React, { useState } from "react";

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState("");

  const processIngredients = (ingredients) => {
    return ingredients.split(",").map(i => i.trim());
  };

  const fetchRecipes = async (items) => {
    try {
      const res = await fetch("https://gdsc-server-fy70.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: items }),
      });
      if (res.status !== 200) {
        throw new Error("Error fetching recipes");
      }
      const data = await res.json();
      return data.recipes;
    } catch (error) {
      return "Error fetching recipes";
    }
  };

  const handleSubmit = async () => {
    const items = processIngredients(ingredients);
    const result = await fetchRecipes(items);
    setRecipes(result);
  };

  const handleInputChange = (e) => {
    setIngredients(e.target.value);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Smart Recipe Recommender</h2>
      <input
        value={ingredients}
        onChange={handleInputChange}
        placeholder="e.g. chicken, spinach, milk"
        style={{ width: "300px", padding: "0.5rem" }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: "1rem" }}>
        Find Recipes
      </button>
      <pre style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>{recipes}</pre>
    </div>
  );
}

export default App;