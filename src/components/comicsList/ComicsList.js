import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./comicsList.scss";
// import uw from "../../resources/img/UW.png";
// import xMen from "../../resources/img/x-men.png";

const ComicsList = () => {
  const [list, setList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllComicses } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComicses(offset).then(onComicsLoaded);
  };

  const onComicsLoaded = (data) => {
    let ended = false;
    if (data.length < 8) {
      ended = true;
    }
    setList((list) => [...list, ...data]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 8);
    setCharEnded(ended);
  };

  const content = (list) => {
    const item = list.map((el, i) => {
      // const price = +el.price > 0 ? `${el.price}$` : "NOT AVAILABLE";
      return (
        <li className="comics__item" key={i}>
          <Link to={`/comics/${el.id}`}>
            <img src={el.image} alt={el.title} className="comics__item-img" />
            <div className="comics__item-name">{el.title}</div>
            <div className="comics__item-price">{el.price}</div>
          </Link>
        </li>
      );
    });
    return <ul className="comics__grid">{item}</ul>;
  };

  const item = content(list);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {item}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
