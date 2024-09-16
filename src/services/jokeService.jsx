export const SaveJokeSubmission = async (transientState) => {
  // options for a post request
  const postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transientState),
  };

  const response = await fetch("http://localhost:8088/jokes", postOptions);

  console.log("Joke Submitted");
};

export const GetAllJokes = async () => {
  const response = await fetch("http://localhost:8088/jokes");
  const results = await response.json();
  return results;
};
