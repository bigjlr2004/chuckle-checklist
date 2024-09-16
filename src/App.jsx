import { useEffect, useState } from "react";
import "./App.css";
import { GetAllJokes, SaveJokeSubmission } from "./services/jokeService";
import stevePic from "./assets/steve.png";

export const App = () => {
  const [userInput, setUserInput] = useState({
    text: "",
    told: false,
  });

  const [allJokes, setAllJokes] = useState([]);
  useEffect(() => {
    GetAllJokes().then((JokesArray) => {
      setAllJokes(JokesArray);
    });
  }, []);
  const [toldJokes, setToldJokes] = useState([]);
  const [unToldJokes, setUnToldJokes] = useState([]);

  useEffect(() => {
    const filteredToldJokes = allJokes.filter((joke) => joke.told);
    setToldJokes(filteredToldJokes);
    const filteredUnToldJokes = allJokes.filter((joke) => !joke.told);
    setUnToldJokes(filteredUnToldJokes);
  }, [allJokes]);

  const updateItem = (evt) => {
    const copy = { ...userInput };
    copy.text = evt.target.value;
    setUserInput(copy);
  };
  const handleAddNewItem = (event) => {
    event.preventDefault();
    if (userInput) {
      SaveJokeSubmission(userInput);
    } else {
      alert(`Please complete the form`);
    }
    GetAllJokes().then((JokesArray) => {
      setAllJokes(JokesArray);
    });
    setUserInput({ text: "", told: false });
  };

  return (
    <div className="app-container">
      <div className="app-heading">
        <div className="app-heading-circle">
          <img className="app-logo" src={stevePic} alt="Good job Steve" />
        </div>
        <h1 className="app-heading-text">Chuckle Checklist</h1>
      </div>
      <h2 className="sam">Add Joke</h2>
      <div className="joke-add-form">
        <input
          value={userInput.text}
          className="joke-input"
          type="text"
          placeholder="New One Liner"
          onChange={(evt) => {
            // What's the value of event?
            updateItem(evt);
            console.log(userInput);
          }}
        />

        <button
          className="joke-input-submit"
          onClick={(event) => {
            handleAddNewItem(event);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};
