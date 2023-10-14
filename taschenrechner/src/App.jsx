import "./App.css"
import { useState } from "react";
import { evaluate } from "mathjs";

function App() {
  const [input, setInput] = useState("");
  const [prevResult, setPrevResult] = useState("");
  const [equalsClicked, setEqualsClicked] = useState(false);
  const [fullMathCalculation, setFullMathCalculation] = useState("");

  function handleClick(e) {
    if (equalsClicked) {
      setInput(e.target.textContent);
      setEqualsClicked(false);
    } else {
      setInput(input.concat(e.target.textContent));
    }
  }

  function clearAll() {
    setInput("");
    setEqualsClicked(false);
    setPrevResult("");
    setFullMathCalculation("");
  }

  function divide() {
    setInput(input.concat(" / "));
    setEqualsClicked(false);
    setPrevResult("");
    setFullMathCalculation(fullMathCalculation.concat(` ${input} / `));
  }

  function multiply() {
    setInput(input.concat(" * "));
    setEqualsClicked(false);
    setPrevResult("");
    setFullMathCalculation(fullMathCalculation.concat(` ${input} * `));
  }

  function percent() {
    setInput(input.concat(" % "));
    setEqualsClicked(false);
    setPrevResult("");
    setFullMathCalculation(fullMathCalculation.concat(` ${input} % `));
  }

  function add() {
    setInput(input.concat(" + "));
    setEqualsClicked(false);
    setPrevResult("");
    setFullMathCalculation(fullMathCalculation.concat(` ${input} + `));
  }

  function subtract() {
    setInput(input.concat(" - "));
    setEqualsClicked(false);
    setPrevResult("");
    setFullMathCalculation(fullMathCalculation.concat(` ${input} - `));
  }

  function equals(e) {
    e.preventDefault();

    if (!equalsClicked) {
      try {
        const currentResult = evaluate(input);

        if (prevResult !== "") {
          const newResult = evaluate(`${prevResult} ${input}`);
          setPrevResult(newResult);
          setInput(newResult.toString());

          setFullMathCalculation(`${prevResult} ${input} = ${newResult}`);
        } else {

          setPrevResult(currentResult);
          setInput(currentResult.toString());
          setFullMathCalculation(`${input} = ${currentResult}`);
        }
        setEqualsClicked(true);

      } catch (error) {
        setInput("Error in Calculation");
        setEqualsClicked(true);
      }
    }
  }

  return (
    <div className="grid-container">
      <div className="grid-item" id="display">
      {/* This will display fullMathCalculation if prevResult is available else it will show only inpust so only the first calculation */}
      {/* {prevResult !== "" ? fullMathCalculation : input}
        */}

{prevResult !== "" ? (
    <span>{fullMathCalculation} <div className="result">{input}</div></span>
  ) : (
    fullMathCalculation !== "" ? fullMathCalculation : input
  )}
      </div>

      <div className="grid-item" onClick={clearAll}>
        C
      </div>
      <div className="grid-item" onClick={handleClick}>
        +/-
      </div>
      <div className="grid-item" onClick={percent}>
        %
      </div>
      <div className="grid-item" onClick={divide}>
        ÷
      </div>
      <div className="grid-item" onClick={handleClick}>
        7
      </div>
      <div className="grid-item" onClick={handleClick}>
        8
      </div>
      <div className="grid-item" onClick={handleClick}>
        9
      </div>
      <div className="grid-item" onClick={multiply}>
        x
      </div>
      <div className="grid-item" onClick={handleClick}>
        4
      </div>
      <div className="grid-item" onClick={handleClick}>
        5
      </div>
      <div className="grid-item" onClick={handleClick}>
        6
      </div>
      <div className="grid-item" onClick={subtract}>
        -
      </div>
      <div className="grid-item" onClick={handleClick}>
        1
      </div>
      <div className="grid-item" onClick={handleClick}>
        2
      </div>
      <div className="grid-item" onClick={handleClick}>
        3
      </div>
      <div className="grid-item" onClick={add}>
        +
      </div>
      <div className="grid-item" onClick={handleClick}>
        0
      </div>
      <div className="grid-item" onClick={handleClick}>
        .
      </div>
      <div className="grid-item" onClick={equals}>
        =
      </div>
    </div>
  );
}

export default App;
