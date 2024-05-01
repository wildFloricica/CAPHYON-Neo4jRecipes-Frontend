import { useState } from "react";
import "./RecipeElement.css";
import App from "../App";
/* eslint-disable react/prop-types */
export default function RecipeElement(props) {
  var { author, ingredients, collections, keywords, dietType, properties } =
    props.recipe;
  var { name, skillLevel, elementId } = properties;

  const [additionalInfo, setAdditionalInfo] = useState(false);
  const [showAuthorsRecipes, setShowAuthorsRecipes] = useState(false);
  return (
    <>
      {/* minimal info about recipe */}
      <tr
        onClick={() => {
          if (additionalInfo) setShowAuthorsRecipes(false);
          setAdditionalInfo(!additionalInfo);
        }}
        className={"rowhover" + (props.oddrow ? " oddrow" : "")}
        key={elementId}
      >
        <td>{name}</td>
        <td
          onClick={(e) => {
            e.stopPropagation();
            if (props?.allow_app_as_child)
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
          <div className={additionalInfo ? "" : "hide"}>
            <div>description: {properties.description}</div>
            <div>cooking time: {properties.cookingTime.low}</div>
            <div>preparation time: {properties.preparationTime.low}</div>
            <div>dietType: {dietType}</div>

            <div>
              ingredients:
              {ingredients.map((i) => (
                <button key={crypto.randomUUID()}>{i}</button>
              ))}
            </div>
            <div>
              collections:
              {collections.map((i) => (
                <button key={crypto.randomUUID()}>{i}</button>
              ))}
            </div>
            <div>
              keywords:
              {keywords.map((i) => (
                <button key={crypto.randomUUID()}>{i}</button>
              ))}
            </div>
          </div>
          {/* authors recipes */}
          {/* make that when it toggles again to keep the data and the page and all state */}
          {showAuthorsRecipes ? <App authorName={author} /> : null}
        </td>
      </tr>
    </>
  );
}
