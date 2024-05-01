import "./FancyList.css";
export default function FancyList({ list = [], special = [], name = "" }) {
  // get the items that are a intersection of the 2 arrays
  special = list.filter((item) => special.includes(item));
  list = list.filter((item) => !special.includes(item));
  return (
    <div className="flex-right fancylist">
      <span className="fancy-title">{name}:</span>
      {special.map((item) => (
        <button key={crypto.randomUUID()} className="special">
          {item}
        </button>
      ))}
      {list.map((item) => (
        <button key={crypto.randomUUID()}>{item}</button>
      ))}
    </div>
  );
}
