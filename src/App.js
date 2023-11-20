import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";

const App = () => {
  const [noteItems, setNoteItems] = useState([]);

  const {
    transcript,
    isListening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript,
  } = useSpeechRecognition();

  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    setUserInput((prevInput) => {
      if (prevInput.trim() === "") {
        return transcript;
      } else {
        return prevInput + " " + transcript;
      }
    });
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  if (!isMicrophoneAvailable) {
    return <span>Please allow access to the microphone</span>;
  }

  const HandleNote = () => {
    if (!userInput.trim() && !transcript.trim()) return; // Don't add empty notes

    const note = userInput || transcript;
    resetTranscript();
    setUserInput("");

    setNoteItems((prevNoteItems) => [...prevNoteItems, note]);
  };

  const DeleteItem = (index) => {
    const newNoteItems = [...noteItems];
    newNoteItems.splice(index, 1);
    setNoteItems(newNoteItems);
  };

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleReset = () => {
    resetTranscript();
    setUserInput("");
  };
  return (
    <div className="container">
      <h2>Note App with Voice Recognition</h2>
      <br />

      <form>
        <textarea
          name="note"
          cols="30"
          rows="10"
          value={userInput}
          onChange={handleUserInputChange}
          placeholder="Type or Speak after clicking on the Start Listening button..."
          type="text"
        />
      </form>

      <div className="btn-style">
        <button onClick={HandleNote} className="button">
          Add Note
        </button>

        <button
          onClick={SpeechRecognition.startListening}
          disabled={isListening}
          className="button"
        >
          Start Listening
        </button>
        <button onClick={SpeechRecognition.stopListening} className="button">
          Stop Listening
        </button>
        <button onClick={handleReset} className="button">
          Reset
        </button>
      </div>

      <div style={{ width: "100%", fontSize: "30px" }}>Notes:</div>
      {noteItems && noteItems.length > 0 ? (
        <div className="note_list">
          {noteItems.map((item, index) => (
            <div key={index} className="note_items">
              <p>{item}</p>
              <button onClick={() => DeleteItem(index)} className="note_delete">
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <h3 style={{ width: "100%", textAlign: "center", fontSize: "20px" }}>
          Your Note list is empty
        </h3>
      )}
    </div>
  );
};

export default App;
