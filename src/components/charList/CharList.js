import React, { Component } from "react";
import PropTypes from "prop-types";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";

import "./charList.scss";

class CharList extends Component {
  state = {
    list: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };
  ref = React.createRef();
  itemRefs = [];

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }
  setRef = (ref) => {
    this.itemRefs.push(ref);
  };

  onItemFocus(i) {
    this.itemRefs.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    this.itemRefs[i].classList.add("char__item_selected");
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = (newList) => {
    let ended = false;
    if (newList.length < 9) {
      ended = true;
    }

    this.setState(({ offset, list }) => ({
      list: [...list, ...newList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  render() {
    const { list, loading, newItemLoading, offset, charEnded } = this.state;
    const spinner = loading ? <Spinner /> : null;
    return (
      <div className="char__list">
        {spinner}
        <ul className="char__grid">
          {list.length > 0 &&
            !loading &&
            list.map(({ id, thumb, name }, i) => {
              const imgStyle =
                thumb ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
                  ? { objectFit: "contain" }
                  : { objectFit: "cover" };
              return (
                <li
                  ref={this.setRef}
                  tabIndex="0"
                  className={"char__item"}
                  key={id}
                  onClick={() => {
                    this.onItemFocus(i);
                    this.props.onCharSelected(id);
                  }}
                >
                  <img src={thumb} alt="character" style={imgStyle} />
                  <div className="char__name">{name}</div>
                </li>
              );
            })}
        </ul>
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{ display: charEnded ? "none" : "block" }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;

CharList.propTypes = {
  onCharSelected: PropTypes.func,
};
