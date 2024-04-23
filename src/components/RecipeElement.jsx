import { useState } from "react";
import "./RecipeElement.css";
/* eslint-disable react/prop-types */
export default function RecipeElement(props) {
  var { properties, ingredients, author } = props.recipe;
  var { name, skillLevel, elementId } = properties;

  const [additionalInfo, setAdditionalInfo] = useState(0);

  return (
    <>
      <tr
        onClick={() => setAdditionalInfo(!additionalInfo)}
        className={"rowhover" + (props.oddrow ? " oddrow" : "")}
        key={elementId}
      >
        <td>{name}</td>
        <td>{author.properties.name}</td>
        <td>{ingredients.length}</td>
        <td>{skillLevel}</td>
      </tr>
      <tr className={"asd " + (additionalInfo ? "" : "hide")}>
        <td colSpan={4}>
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
        </td>
      </tr>
    </>
  );
}
