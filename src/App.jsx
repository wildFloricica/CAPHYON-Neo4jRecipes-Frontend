import { useEffect, useState } from "react";
import "./App.css";

const BACKEND_API = "http://localhost:3001/api/";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [recipePage, setRecipePage] = useState(0);
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    fetch(BACKEND_API + "recipes_page=" + recipePage)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      });
  }, [recipePage]);

  return (
    <>
      <div>
        <button onClick={() => setRecipePage(recipePage - 1)}>⏮️</button>
        <a href="#">{recipePage}</a>
        <button onClick={() => setRecipePage(recipePage + 1)}>⏭️</button>
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
          {recipes.map(({ properties, ingredients, author }) => {
            var { name, skillLevel, elementId } = properties;

            return (
              <tr key={elementId}>
                <td>{name}</td>
                <td>{author.properties.name}</td>
                <td>{ingredients.length}</td>
                <td>{skillLevel}</td>
              </tr>
            );
          })}
        </tbody>

        <tfoot></tfoot>
      </table>
    </>
  );
}

export default App;
