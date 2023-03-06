// import AppBanner from "../appBanner/AppBanner";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import AppBanner from "../appBanner/AppBanner";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./singleComicPage.scss";

const SingleCharPage = () => {
  const { charName } = useParams();
  const [charInfo, setCharInfo] = useState(null);
  const { loading, error, getComicByName, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
    console.log(charName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charName]);

  const updateChar = () => {
    clearError();

    getComicByName(charName).then((data) => {
      charInfoLoaded(data);
      // console.log(data);
    });
  };

  const charInfoLoaded = (info) => {
    setCharInfo(info[0]);
    console.log(info[0]);
  };
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !charInfo) ? (
    <View char={charInfo} />
  ) : null;

  return (
    <>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ char }) => {
  return (
    <div className="single-comic">
      <img
        src={char.thumb}
        alt={char.name}
        className="single-comic-char__img"
      />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{char.name}</h2>
        <p className="single-comic__descr">{char.description}</p>
      </div>
      <Link to="/" className="single-comic__back">
        Back to main page
      </Link>
    </div>
  );
};

export default SingleCharPage;
