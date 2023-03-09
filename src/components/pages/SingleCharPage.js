import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";
import AppBanner from "../appBanner/AppBanner";

import "./singleComicPage.scss";

const SingleCharPage = () => {
  const { charName } = useParams();
  const [charInfo, setCharInfo] = useState(null);
  const { getComicByName, clearError, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    updateChar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charName]);

  const updateChar = () => {
    clearError();

    getComicByName(charName)
      .then((data) => {
        charInfoLoaded(data);
      })
      .then(() => setProcess("confirmed"));
  };

  const charInfoLoaded = (info) => {
    setCharInfo(info[0]);
  };

  return (
    <>
      <AppBanner />
      {setContent(process, View, charInfo)}
    </>
  );
};

const View = ({ data }) => {
  const { thumb, name, description } = data;
  return (
    <div className="single-comic">
      <Helmet>
        <meta name="description" content={`${name} character page`} />
        <title>{name}</title>
      </Helmet>
      <img src={thumb} alt={name} className="single-comic-char__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{name}</h2>
        <p className="single-comic__descr">{description}</p>
      </div>
      <Link to="/" className="single-comic__back">
        Back to main page
      </Link>
    </div>
  );
};

export default SingleCharPage;
