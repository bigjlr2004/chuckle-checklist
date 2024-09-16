import { useState } from "react";
import "./App.css";
import { SaveJokeSubmission } from "./services/jokeService";
import stevePic from "./assets/steve.png";

export const App = () => {
  const [userInput, setUserInput] = useState({
    text: "",
    told: false,
  });
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
    setUserInput({ text: "", told: false });
  };

  return (
    <div className="app-container">
      <div className="app-heading">
        <div className="app-heading-circle">
          <img className="app-logo" src={stevePic} alt="Good job Steve" />
        </div>
        <h1 className="app-heading-text">Chuckle Checklist</h1>
        <h2>Add Joke</h2>
      </div>
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
