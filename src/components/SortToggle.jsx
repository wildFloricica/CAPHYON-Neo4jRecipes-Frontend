import { useEffect, useState } from "react";

export default function SortToggle({ handlechange = () => {} }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    console.log("asdasd");
    var result = "";
    if (active == "up") result = "ASC";
    else if (active == "down") result = "DESC";
    handlechange(result);
    console.log("asdasdasdasd");
  }, [active]);

  return (
    <div className="flex-down">
      <button
        style={{ transition: "none" }}
        className={"up " + (active == "up" ? "active" : "")}
        onClick={() => setActive((old) => (old == "up" ? "" : "up"))}
      >
        ⬆️
      </button>
      <button
        style={{ transition: "none" }}
        className={"down " + (active == "down" ? "active" : "")}
        onClick={() => setActive((old) => (old == "down" ? "" : "down"))}
      >
        ⬇️
      </button>
    </div>
  );
}
