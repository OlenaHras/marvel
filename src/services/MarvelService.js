import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=32239585eebc8c5fbb2e36f6a3442c6f";
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComicses = async (offset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComics);
    // return res.data.results;
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const getComicByName = async (name) => {
    const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
    // console.log(res.data);
    return res.data.results.map(_transformCharacter);
    // return res.data.results.length > 0
    //   ? _transformCharacter(res.data.results[0])
    //   : null;
    // https://gateway.marvel.com:443/v1/public/characters?name=Thor&apikey=32239585eebc8c5fbb2e36f6a3442c6f
  };

  const _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description,
      thumb: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      id: char.id,
      comics: char.comics.items,
    };
  };
  const _transformComics = (comics) => {
    return {
      title: comics.title,
      description: comics.description
        ? comics.description
        : "There is no description",
      image: comics.thumbnail.path + "." + comics.thumbnail.extension,
      price:
        +comics.prices[0].price > 0
          ? `${comics.prices[0].price}$`
          : "NOT AVAILABLE",
      id: comics.id,
      pageCount: comics.pageCount
        ? `${comics.pageCount} p.`
        : "No information about the number of pages",
      language: comics.textObjects.language || "en-us",
    };
  };
  return {
    loading,
    error,
    clearError,
    getAllCharacters,
    getCharacter,
    getAllComicses,
    getComic,
    getComicByName,
  };
};
export default useMarvelService;
