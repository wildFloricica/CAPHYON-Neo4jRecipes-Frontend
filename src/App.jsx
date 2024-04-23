import { useEffect, useState } from "react";
import "./App.css";
import RecipeElement from "./components/RecipeElement";

const BACKEND_API = "http://localhost:3001/api/";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [recipePage, setRecipePage] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [querry, setQuerry] = useState("");

  useEffect(() => {
    fetch(BACKEND_API + "recipes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_nr: recipePage, querry }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      });
  }, [recipePage, querry]);

  return (
    <>
      {/* pagination */}
      <div>
        <button onClick={() => setRecipePage(recipePage - 1)}>⏮️</button>
        <a href="#">{recipePage}</a>
        <button onClick={() => setRecipePage(recipePage + 1)}>⏭️</button>
      </div>

      {/* by recipe name */}
      <div>
        <label htmlFor="">
          Search by recipe name:
          <input
            type="text"
            placeholder="🔎Search"
            onInput={(e) => setQuerry(e.target.value)}
          />
        </label>
      </div>

      <h1>Recipe Table</h1>
      <table>
        <thead>
          <tr>
            <td>name</td>
            <td>author</td>
            <td>ingredients</td>
            <td>skill level</td>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <RecipeElement
              oddrow={index % 2}
              key={recipe.elementId}
              recipe={recipe}
            ></RecipeElement>
          ))}
        </tbody>

        <tfoot></tfoot>
      </table>
    </>
  );
}

export default App;
