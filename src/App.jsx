/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./App.css";
import RecipeElement from "./components/RecipeElement";
import { WithContext as ReactTags } from "react-tag-input";
import FancyList from "./components/FancyList";
import SortToggle from "./components/SortToggle";
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
  const [sortProperty, setSortProperty] = useState({
    order: ["recipe_name"],
    recipe_name: "ASC",
    ingr_count: false,
    skillLevel: false,
  });
  const ingredientsQuerry = tags.map((tag) => tag.text);
  const [topComplexRecipes, setTopComplexRecipes] = useState([]);
  const [mostCommonIngredients, setMostCommonIngredients] = useState([]);
  const [mostProlificAuthors, setMostProlificAuthors] = useState([]);

  useEffect(() => {
    if (recipes == undefined) return;

    var a_temp = {};
    var i_temp = {};

    recipes.forEach((recipe) => {
      const author = recipe.author;
      a_temp[author] = a_temp[author] + 1 || 1;
      recipe.ingredients.forEach((i) => (i_temp[i] = i_temp[i] + 1 || 1));
    });

    const dothething = (obj) => {
      var sortable = [];
      for (var a of Object.keys(obj)) sortable.push([a, obj[a]]);
      return sortable
        .toSorted((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([a, b]) => a + "/" + b);
    };

    setMostProlificAuthors(dothething(a_temp));
    setMostCommonIngredients(dothething(i_temp));
  }, [recipes]);

  useEffect(() => {
    fetch(BACKEND_API + "all-ingredients")
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data.map((it) => ({ id: it, name: it, text: it })));
      });
  }, []);

  useEffect(() => {
    if (0 && localStorage.getItem("temppp")) {
      const data = JSON.parse(localStorage.getItem("temppp"));
      setRecipes(data?.normal);
      setTopComplexRecipes(data.topcomplex);
      return;
    }

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
        console.log("data", data);
        setRecipes(data?.normal);
        setTopComplexRecipes(data.topcomplex);
      });
    return () => controller.abort();
  }, [pageNr, querry, tags, sortProperty]);

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

  function updateSort(obj) {
    const column = Object.keys(obj)[0];
    setSortProperty((old) => {
      old.order = old.order.filter((it) => it != column);
      if (obj[column]) old.order = [column, ...old.order];
      return { recipe_name: "ASC", ...Object.assign(old, obj) };
    });
  }

  return (
    <div className={authorName ? "nested-table" : ""}>
      {/* filtering recipes */}
      <>
        <div className="flex-right justify-start">
          <h3>🔎Filter by</h3>
          <label htmlFor="">
            <input
              type="text"
              placeholder="name"
              onInput={(e) => setQuerry(e.target.value)}
            />
          </label>
          <ReactTags
            placeholder="ingredients"
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

      <div className="flex-right tables-hugger">
        <table className="get-sticky">
          <thead>
            <tr>
              <td>Name</td>
              <td>Author</td>
              <td>
                <div className=" sortertoggle flex-right">
                  <SortToggle
                    handlechange={(t) => updateSort({ ingr_count: t })}
                  />
                  ingredients
                </div>
              </td>
              <td>
                <div className="sortertoggle flex-right">
                  <SortToggle
                    handlechange={(t) => updateSort({ skillLevel: t })}
                  />
                  skill level
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

            <tr className="sticky-pagination">
              <td colSpan={4}>
                <div className="flex-down">
                  <div className="flex-right">
                    <span>page: {pageNr}</span>
                    <button onClick={() => setPageNr(pageNr - 1)}>⏮️</button>
                    <input
                      width={10}
                      type="text"
                      onInput={(e) => {
                        if (!e.target.value) return;
                        clearTimeout(tiid);
                        tiid = setTimeout(() => {
                          setPageNr(parseInt(e.target.value) || 0);
                        }, 300);
                      }}
                    />
                    <button onClick={() => setPageNr(pageNr + 1)}>⏭️</button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className={"get-sticky " + (authorName ? "hide" : "")}>
          <td colSpan={4}>
            <h2>top 5 most complex</h2>
            <table>
              <thead>
                <tr>
                  <td>recipe name</td>
                  <td>author</td>
                  <td>ingredients</td>
                  <td>skill level</td>
                </tr>
              </thead>
              <tbody>
                {!authorName &&
                  topComplexRecipes?.map((recipe, index) => (
                    <RecipeElement
                      ingredientsQuerry={ingredientsQuerry}
                      allow_app_as_child={true}
                      oddrow={index % 2}
                      key={crypto.randomUUID()}
                      recipe={recipe}
                    ></RecipeElement>
                  ))}

                {/* <tr>
                  <td colSpan={4}></td>
                </tr> */}
              </tbody>
            </table>
            <div className="bg-myblue comfy">
              <FancyList
                list={mostCommonIngredients}
                name="top 5 🥕ingredients"
              />
              <FancyList list={mostProlificAuthors} name="top 5 👨🏽‍🦰authors" />
            </div>
          </td>
        </div>
      </div>
    </div>
  );
}

export default App;
