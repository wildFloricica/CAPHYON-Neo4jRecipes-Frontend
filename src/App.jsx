/* eslint-disable react/prop-types */
import { useDebugValue, useEffect, useState } from "react";
import "./App.css";
import RecipeElement from "./components/RecipeElement";
import { WithContext as ReactTags } from "react-tag-input";
import FancyList from "./components/FancyList";
const BACKEND_API = "http://localhost:3001/api/";

var tiid = undefined;

function App({ authorName }) {
  // todo: fix multiple useles rerenders
  // extraact pagination and sorting in separate components
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

  const [mostCommonIngredients, setMostCommonIngredients] = useState([]);
  const [mostProlificAuthors, setMostProlificAuthors] = useState([]);

  useEffect(() => {
    if (recipes == undefined) return;
    var _auth_temp = {};
    var _ingr_temp = {};
    recipes.forEach((recipe) => {
      const author = recipe.author;
      if (_auth_temp[author] == undefined) _auth_temp[author] = 1;
      else _auth_temp[author]++;

      recipe.ingredients.forEach((i) => {
        if (_ingr_temp[i] == undefined) _ingr_temp[i] = 1;
        else _ingr_temp[i]++;
      });
    });

    var auth_sortable = [];
    for (var auth of Object.keys(_auth_temp)) {
      auth_sortable.push([auth, _auth_temp[auth]]);
    }
    auth_sortable.sort(function (a, b) {
      return -a[1] + b[1];
    });

    var _mostProlificAuthors = [];
    var _mostCommonIngredients = [];
    _mostProlificAuthors = auth_sortable.slice(0, 5);

    var ingr_sortable = [];
    for (var i of Object.keys(_ingr_temp)) {
      ingr_sortable.push([i, _ingr_temp[i]]);
    }
    console.log("ingrsortable", ingr_sortable);
    ingr_sortable.sort(function (a, b) {
      return -a[1] + b[1];
    });
    _mostCommonIngredients = ingr_sortable.slice(0, 5);
    console.log(_mostCommonIngredients, _mostProlificAuthors);

    _mostCommonIngredients = _mostCommonIngredients.map(
      ([a, b]) => a + "/" + b
    );
    _mostProlificAuthors = _mostProlificAuthors.map(([a, b]) => a + "/" + b);

    setMostCommonIngredients(_mostCommonIngredients);
    setMostProlificAuthors(_mostProlificAuthors);
  }, [recipes]);

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
        console.log(data);
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
  console.log("rerender");
  return (
    <div className={authorName ? "greyall" : ""}>
      {/* pagination */}
      <div className="flex-down">
        <div>
          <button onClick={() => setPageNr(pageNr - 1)}>⏮️</button>
          <button onClick={() => setPageNr(pageNr + 1)}>⏭️</button>
          <span>{pageNr}</span>
          <input
            type="text"
            onInput={(e) => {
              if (!e.target.value) return;
              clearTimeout(tiid);
              tiid = setTimeout(() => {
                setPageNr(parseInt(e.target.value) || 0);
              }, 300);
            }}
          />
        </div>
      </div>
      {/* options */}
      <>
        <input
          type="checkbox"
          name=""
          id="trim-input"
          onInput={() => setTrimRecipeName((old) => !old)}
        />
        <label htmlFor="trim-input">Trim recipe name in backend:</label>
      </>
      {/* filter recipes */}
      <>
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
      </>

      {/* statistics */}
      <>
        <FancyList list={mostCommonIngredients} name="top 5 🥕ingredients" />
        <FancyList list={mostProlificAuthors} name="top 5 👨🏽‍🦰authors" />
      </>
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
              ingredientsQuerry={ingredientsQuerry}
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
