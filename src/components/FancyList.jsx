import "./FancyList.css";
export default function FancyList({
  list = [],
  special = [],
  name = "",
  max_width = 500,
}) {
  // get the items that are a intersection of the 2 arrays
  special = list.filter((item) => special.includes(item));
  list = list.filter((item) => !special.includes(item));
  return (
    <>
      <div
        style={{ width: max_width + "px" }}
        className="flex-right-hugger fancy-list"
      >
        <span className="fancy-title">{name}:</span>
        <div className="flex-right fancylist">
          {special.map((item) => (
            <button key={crypto.randomUUID()} className="special">
              {item}
            </button>
          ))}
          {list.map((item) => (
            <button key={crypto.randomUUID()}>{item}</button>
          ))}
        </div>
      </div>
    </>
  );
}
