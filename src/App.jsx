/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./App.css";
import RecipeElement from "./components/RecipeElement";
import { WithContext as ReactTags } from "react-tag-input";
const BACKEND_API = "http://localhost:3001/api/";

function App({ authorName }) {
  const [pageNr, setPageNr] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [querry, setQuerry] = useState("");
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [trimRecipeName, setTrimRecipeName] = useState(false);
  const [sortProperty, setSortProperty] = useState({
    property: "name",
    type: "ASC",
  });
  const ingredientsQuerry = tags.map((tag) => tag.text);

  useEffect(() => {
    fetch(BACKEND_API + "all-ingredients")
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.map((it) => ({ id: it, name: it, text: it })));
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(BACKEND_API + "recipes", {
      signal,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorName,
        sortProperty,
        trimRecipeName,
        pageNr,
        ingredientsQuerry,
        querry,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("AbortError: Fetch request aborted");
        }
      })
      .then((data) => {
        setRecipes(data);
      });
    return () => controller.abort();
  }, [pageNr, querry, tags, sortProperty, trimRecipeName]);

  const handleDelete = (i) => setTags(tags.filter((tag, index) => index !== i));
  const handleAddition = (tag) => setTags([...tags, tag]);
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };
  const handleTagClick = () => {};

  return (
    <div className={authorName ? "greyall" : ""}>
      {/* pagination */}
      <div>
        <button onClick={() => setPageNr(pageNr - 1)}>⏮️</button>
        <a href="#">{pageNr}</a>
        <button onClick={() => setPageNr(pageNr + 1)}>⏭️</button>
      </div>

      <input
        type="checkbox"
        name=""
        id="trim-input"
        onInput={() => setTrimRecipeName((old) => !old)}
      />
      <label htmlFor="trim-input">Trim recipe name in backend:</label>

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
          inputFieldPosition="bottom"
          {...{
            tags,
            suggestions,
            handleDelete,
            handleAddition,
            handleDrag,
            handleTagClick,
          }}
          autocomplete
        />
      </div>

      <table>
        <thead>
          <tr>
            <td>recipe name</td>
            <td>author</td>
            <td>
              <div className=" sortertoggle flex-right">
                number of ingredients
                <div className="flex-down">
                  <button
                    className="up"
                    onClick={() =>
                      setSortProperty({ property: "ingr_count", type: "ASC" })
                    }
                  >
                    ASC
                  </button>
                  <button
                    className="down"
                    onClick={() =>
                      setSortProperty({ property: "ingr_count", type: "DESC" })
                    }
                  >
                    DES
                  </button>
                </div>
              </div>
            </td>
            <td>
              <div className="sortertoggle flex-right">
                skill level
                <div className="flex-down">
                  <button
                    className="up"
                    onClick={() =>
                      setSortProperty({ property: "skillLevel", type: "ASC" })
                    }
                  >
                    ASC
                  </button>
                  <button
                    className="down"
                    onClick={() =>
                      setSortProperty({ property: "skillLevel", type: "DESC" })
                    }
                  >
                    DES
                  </button>
                </div>
                <div />
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          {recipes?.map((recipe, index) => (
            <RecipeElement
              allow_app_as_child={!authorName}
              oddrow={index % 2}
              key={crypto.randomUUID()}
              recipe={recipe}
            ></RecipeElement>
          ))}
        </tbody>

        <tfoot>
          <tr className={recipes?.length ? "hide" : ""}>
            <td colSpan={4}>End of recipees</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
