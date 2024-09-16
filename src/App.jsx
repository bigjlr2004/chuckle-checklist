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
  const HandleToggleJoke = (event) => {
    event.preventDefault();
    const jokeId = event.target.id; // Get the ID from the event
    const jokeIndex = allJokes.findIndex(
      (joke) => joke.id.toString() === jokeId
    ); // Find the index of the joke

    if (jokeIndex !== -1) {
      // Check if the joke exists
      // Toggle the 'told' property
      allJokes[jokeIndex].told = !allJokes[jokeIndex].told;

      // Prepare the updated joke data
      const updatedJoke = {
        ...allJokes[jokeIndex], // Spread the existing joke properties
        told: allJokes[jokeIndex].told, // Update the 'told' property
      };

      // Make a PUT request to update the joke on the server
      fetch(`http://localhost:8088/jokes/${jokeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJoke), // Send the updated joke data
      })
        .then((response) => response.json())
        .then(() => {
          // Fetch all jokes again and update the state
          GetAllJokes().then((JokesArray) => {
            setAllJokes(JokesArray);
          });
        })
        .catch((error) => {
          console.error("Error updating joke:", error);
        });
    }

    // Reset user input
    setUserInput({ text: "", told: false });
  };
  const HandleDeleteJoke = (event) => {
    event.preventDefault();
    const jokeId = event.target.id; // Get the ID from the event

    // Make a DELETE request to remove the joke from the server
    fetch(`http://localhost:8088/jokes/${jokeId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // If the response is successful, fetch all jokes again
          return GetAllJokes(); // Return the promise
        } else {
          throw new Error("Failed to delete joke"); // Handle errors
        }
      })
      .then((JokesArray) => {
        // Update the state with the new jokes array
        setAllJokes(JokesArray);
      })
      .catch((error) => {
        console.error("Error deleting joke:", error);
      });
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
      <div className="joke-lists-container">
        <div className="joke-list-container">
          <h2 className="sam">
            UnTold{" "}
            <span className="untold-count">Count: {unToldJokes.length}</span>
          </h2>
          <ul>
            {unToldJokes.map((joke) => {
              return (
                <li className="joke-list-item" key={joke.id}>
                  <p className="joke-list-item-text">{joke.text}</p>
                  <button
                    className="joke-list-action-toggle"
                    onClick={(event) => {
                      HandleDeleteJoke(event);
                    }}
                  >
                    <i className="fa-solid fa-trash" id={joke.id}></i>
                  </button>
                  <button
                    className="joke-list-action-toggle"
                    onClick={(event) => {
                      HandleToggleJoke(event);
                    }}
                  >
                    <i className="fa-regular fa-face-meh" id={joke.id} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="joke-list-container">
          <h2 className="sam">
            Told <span className="told-count">Count: {toldJokes.length}</span>
          </h2>
          <ul>
            {toldJokes.map((joke) => {
              return (
                <li className="joke-list-item" key={joke.id}>
                  <p className="joke-list-item-text">{joke.text}</p>
                  <button
                    className="joke-list-action-toggle"
                    onClick={(event) => {
                      HandleDeleteJoke(event);
                    }}
                  >
                    <i className="fa-solid fa-trash" id={joke.id}></i>
                  </button>
                  <button
                    className="joke-list-action-toggle"
                    onClick={(event) => {
                      HandleToggleJoke(event);
                    }}
                  >
                    <i className="fa-regular fa-face-meh" id={joke.id} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
