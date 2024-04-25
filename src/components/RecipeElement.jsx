import { useState } from "react";
import "./RecipeElement.css";
import App from "../App";
/* eslint-disable react/prop-types */
export default function RecipeElement(props) {
  var { properties, ingredients, author } = props.recipe;
  var { name, skillLevel, elementId } = properties;

  const [additionalInfo, setAdditionalInfo] = useState(false);
  const [showAuthorsRecipes, setShowAuthorsRecipes] = useState(false);
  return (
    <>
      <tr
        onClick={() => setAdditionalInfo(!additionalInfo)}
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
          {author.properties.name}
        </td>
        <td>{ingredients.length}</td>
        <td>{skillLevel}</td>
      </tr>
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
            <div>
              ingredients:
              {ingredients.map((ingredient) => (
                <button key={ingredient.elementId}>
                  {ingredient.properties.name}
                </button>
              ))}
            </div>
          </div>
          {/* authors recipes */}
          {/* make that when it toggles again to keep the data and the page and all state */}
          {showAuthorsRecipes ? (
            <App byauthor={true} author_name={author.properties.name} />
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}
