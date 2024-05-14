import { useEffect, useState } from "react";
import "./RecipeElement.css";
import FancyList from "./FancyList";
import App from "../App";
/* eslint-disable react/prop-types */
const BACKEND_API = "http://localhost:3001/api/";
export default function RecipeElement(props) {
  const iq = props.ingredientsQuerry;
  var { author, ingredients, collections, keywords, dietTypes, properties } =
    props.recipe;
  var { name, skillLevel, elementId } = properties;

  const [additionalInfo, setAdditionalInfo] = useState(false);
  const [showAuthorsRecipes, setShowAuthorsRecipes] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState([
    { properties: { name: "loading......." } },
  ]);

  const iis = ingredients.length;
  const ks = keywords.length;
  const cs = collections.length;
  const dts = dietTypes.length;

  useEffect(() => {
    if (!additionalInfo) return;
    else
      fetch(BACKEND_API + "similar", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeName: name }),
      })
        .then((res) => res.json())
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("AbortError: Fetch request aborted");
          }
        })
        .then((data) => {
          setSimilarRecipes(data);
          console.log("similar", data);
        });
  }, [additionalInfo]);
  return (
    <>
      {/* minimal info about recipe */}
      <tr
        onClick={() => {
          if (additionalInfo) setShowAuthorsRecipes(false);
          setAdditionalInfo(!additionalInfo);
        }}
        className={"rowhover" + (props.oddrow ? " oddrow " : "")}
        key={elementId}
      >
        <td>{name}</td>
        <td
          onClick={(e) => {
            e.stopPropagation();
            if (props?.allow_app_as_child && author)
              setShowAuthorsRecipes(!showAuthorsRecipes);
          }}
        >
          {author}
        </td>
        <td>{ingredients.length}</td>
        <td>{skillLevel}</td>
      </tr>

      {/* additional infos // authors recipes */}
      <tr
        className={
          "asd aditionalinfo " +
          (additionalInfo || showAuthorsRecipes ? "" : "hide")
        }
      >
        <td style={{ padding: 0 }} colSpan={4}>
          {/* additional info */}
          <div className={"infos " + (additionalInfo ? "" : "hide")}>
            <div>📝description: {properties.description}</div>
            <div>⌛cooking time: {properties.cookingTime.low}</div>
            <div>⌛preparation time: {properties.preparationTime.low}</div>
            <FancyList list={dietTypes} name="🥗diet types" />
            <FancyList list={ingredients} special={iq} name="🥕ingredients" />
            <FancyList list={keywords} name="🔑keywords" />
            <FancyList list={collections} name="🗂️collections" />
            <FancyList
              list={similarRecipes?.map((it) => {
                var {
                  ingredients: _diis,
                  keywords: _dks,
                  collections: _dcs,
                  dietTypes: _ddts,
                } = it;

                const diis = _diis?.length;
                const dks = _dks?.length;
                const dcs = _dcs?.length;
                const ddts = _ddts?.length;

                var p = 0;
                if (iis) p += (diis / iis) * 1;
                if (dks) p += (dks / ks) * 1;
                if (cs) p += (dcs / cs) * 1;
                if (dts) p += (ddts / dts) * 1;
                console.log(p);
                return (
                  it.properties.name +
                  " " +
                  (Math.round((p / 4) * 100 * 100) / 100).toFixed(2) +
                  " %"
                );
              })}
              name="🤏similar"
            />
          </div>
          {/* authors recipes */}
          {/* make that when it toggles again to keep the data and the page and all state */}
          {showAuthorsRecipes ? <App authorName={author} /> : null}
        </td>
      </tr>
    </>
  );
}
