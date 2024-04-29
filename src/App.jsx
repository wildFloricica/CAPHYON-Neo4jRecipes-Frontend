/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./App.css";
import RecipeElement from "./components/RecipeElement";
import { WithContext as ReactTags } from "react-tag-input";
const BACKEND_API = "http://localhost:3001/api/";

function App(props) {
  // eslint-disable-next-line no-unused-vars
  const [recipePage, setRecipePage] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [querry, setQuerry] = useState("");
  const [tags, setTags] = useState([]);
  const [suggestionss, setSuggestions] = useState([]);
  const myIngrTags = tags.map((tag) => tag.text);
  console.log(myIngrTags);

  useEffect(() => {
    fetch(BACKEND_API + "all-ingredients")
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.map((it) => ({ id: it, name: it, text: it })));
        console.log(suggestionss);
      });
  }, []);

  useEffect(() => {
    console.log(props?.byauthor, props?.author_name);
    fetch(BACKEND_API + (props?.byauthor ? "authors-recipes" : "recipes"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author_name: props?.author_name,
        page_nr: recipePage,
        ingredientsQuerry: myIngrTags,
        querry,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
      });
  }, [recipePage, querry, tags]);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
    console.log("dragged", tags, newTags);
  };

  const handleTagClick = (index) => {
    console.log("The tag at index " + index + " was clicked");
  };

  return (
    <div className={props?.byauthor ? "greyall" : ""}>
      {/* pagination */}
      <div>
        <button onClick={() => setRecipePage(recipePage - 1)}>⏮️</button>
        <a href="#">{recipePage}</a>
        <button onClick={() => setRecipePage(recipePage + 1)}>⏭️</button>
      </div>

      <h3>🔎Search recipe</h3>
      <div className="flex-right">
        {/* by recipe name */}
        <label htmlFor="">
          <input
            type="text"
            placeholder="🔎by name"
            onInput={(e) => setQuerry(e.target.value)}
          />
        </label>
        {/* by ingredients */}
        <ReactTags
          placeholder="🔎by ingredients"
          tags={tags}
          suggestions={suggestionss}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
        />
      </div>

      <table>
        <thead>
          <tr>
            <td>recipe name</td>
            <td>author</td>
            <td style={{ wordWrap: "break-word" }}>number of ingredients</td>
            <td>skill level</td>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <RecipeElement
              allow_app_as_child={!props?.byauthor}
              oddrow={index % 2}
              key={recipe.elementId}
              recipe={recipe}
            ></RecipeElement>
          ))}
        </tbody>

        <tfoot>
          <tr className={recipes.length ? "hide" : ""}>
            <td colSpan={4}>End of recipees</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
