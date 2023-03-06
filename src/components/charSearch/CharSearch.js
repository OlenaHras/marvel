import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import { object, string } from "yup";
import { useState } from "react";
import { Link } from "react-router-dom";
import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./charSearch.scss";

const CharSearch = () => {
  const [charValue, setCharValue] = useState(null);

  const { getComicByName, clearError, error } = useMarvelService();

  const onCharacterLoaded = (char) => {
    setCharValue(char);
  };

  const updateChar = ({ name }) => {
    clearError();

    getComicByName(name).then((data) => {
      onCharacterLoaded(data);
    });
  };

  const errorMessage = error ? (
    <div className="char__search-critical-error">
      <ErrorMessage name="name" />
    </div>
  ) : null;

  const result = !charValue ? null : charValue.length > 0 ? (
    <div className="char__search-wrapper">
      <div className="char__search-success">
        There is! Visit{" "}
        <Link to={`/${charValue[0].name}`}>{charValue[0].name}</Link> page?
      </div>
      <Link
        to={`/characters/${charValue[0].name}`}
        className="button button__secondary"
      >
        <div className="inner">to page</div>
      </Link>
    </div>
  ) : (
    <div className="char__search-error">
      "The character was not found. Check the name and try again"
    </div>
  );

  return (
    <div className="char__search-form">
      <Formik
        initialValues={{ name: "" }}
        validationSchema={object({
          name: string().required("This field is required"),
        })}
        onSubmit={(values) => {
          updateChar(values);
        }}
      >
        <>
          <Form onChange={(e) => (!e.target.value ? setCharValue(null) : null)}>
            <label htmlFor="inner" className="char__search-label">
              Or find a character by name:
            </label>
            <div className="wrapper">
              <Field
                type="name"
                name="name"
                className="char__search-input"
                placeholder="Enter name"
              />

              <button type="submit" className="button button__main">
                <div className="inner">find</div>
              </button>
            </div>
            <FormikErrorMessage
              name="name"
              component="div"
              className="char__search-error"
            />
          </Form>
        </>
      </Formik>
      {result}
      {errorMessage}
    </div>
  );
};

export default CharSearch;
