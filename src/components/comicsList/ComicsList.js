import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./comicsList.scss";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
    case "confirmed":
      return <Component />;
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process state");
  }
};

const ComicsList = () => {
  const [list, setList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);

  const { getAllComicses, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComicses(offset)
      .then(onComicsLoaded)
      .then(() => setProcess("confirmed"));
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

  return (
    <div className="comics__list">
      {setContent(process, () => content(list), newItemLoading)}

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
