import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { evaluate } from "mathjs";
import { Button, Col, Row, Typography, Modal, Flex, Form } from "antd";
import { theming } from "../theming"
import { FaDeleteLeft, FaCalculator } from "react-icons/fa6";
import { TbMathSymbols, TbMathFunction } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import "./App.css"

const { Text } = Typography;

export const App = () => {
  const [input, setInput] = useState<string>("");
  const [prevResult, setPrevResult] = useState<string>("");
  const [equalsClicked, setEqualsClicked] = useState<boolean>(false);
  const [fullMathCalculation, setFullMathCalculation] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [memory, setMemory] = useState<number | null>(null);
  const [angleMode, setAngleMode] = useState<"rad" | "deg">("deg");
  const [fontSize, setFontSize] = useState<number>(3.5);

  const textRef = useRef<HTMLDivElement>(null);

  const scientificSymbols = [
    { label: "(", value: "(" },
    { label: ")", value: ")" },
    { label: "mc", value: "mc" },
    { label: "m+", value: "m+" },
    { label: "m-", value: "m-" },
    { label: "mr", value: "mr" },
    { label: "2ⁿᵈ", value: "2ⁿᵈ" },
    { label: "x²", value: "^2" },
    { label: "x³", value: "^3" },
    { label: "xʸ", value: "^" },
    { label: "eˣ", value: "e^" },
    { label: "10ˣ", value: "10^" },
    { label: "1/x", value: "1/" },
    { label: "2√x", value: "sqrt(" },
    { label: "3√x", value: "cbrt(" },
    { label: "y√x", value: "^(1/" },
    { label: "In", value: "ln(" },
    { label: "log₁₀", value: "log(" },
    { label: "x!", value: "!" },
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "e", value: "e" },
    { label: "EE", value: "E" },
    { label: "Rand", value: "rand()" },
    { label: "sinh", value: "sinh(" },
    { label: "cosh", value: "cosh(" },
    { label: "tanh", value: "tanh(" },
    { label: "π", value: "pi" },
    { label: angleMode === "rad" ? "Deg" : "Rad", value: "angleMode" },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = (value: string): void => {
    if (equalsClicked) {
      setInput(value);
      setEqualsClicked(false);
    } else {
      if (value === "mc") {
        setMemory(null);
      } else if (value === "m+") {
        if (memory !== null) setMemory(memory + Number(input));
        else setMemory(Number(input));
      } else if (value === "m-") {
        if (memory !== null) setMemory(memory - Number(input));
        else setMemory(-Number(input));
      } else if (value === "mr") {
        if (memory !== null) setInput(input + memory.toString());
      } else if (value === "angleMode") {
        setAngleMode((prev) => (prev === "rad" ? "deg" : "rad"));
      } else if (value === "!") {

        try {
          const factorial = (n: number): number =>
            n <= 1 ? 1 : n * factorial(n - 1);
          const factResult = factorial(Number(input));
          setInput(factResult.toString());
        } catch {
          setInput("Rechenfehler");
        }
      } else {
        setInput(input + value);
      }
    }
  };

  const deleteLastOrDeleteAll = (): void => {
    if (input && !equalsClicked) {
      setInput(input.slice(0, -1));
    } else {
      clearAll();
    }
  }

  const clearAll = (): void => {
    setInput("");
    setEqualsClicked(false);
    setPrevResult("");
    setFullMathCalculation("");
  };

  const handleOperation = (operator: string): void => {
    setInput(input + ` ${operator} `);
    setEqualsClicked(false);
    setPrevResult("");
  };

  const equals = (): void => {
    if (!equalsClicked) {
      try {
        const openParenthesesCount = (input.match(/\(/g) || []).length;
        const closeParenthesesCount = (input.match(/\)/g) || []).length;
        const missingParenthesesCount = openParenthesesCount - closeParenthesesCount;

        let correctedInput = input + ")".repeat(missingParenthesesCount);

        // Checking if Deg or Rad Button was pressed, and converting between degree and radians
        if (angleMode === "deg") {
          correctedInput = correctedInput.replace(/sin\(/g, "sin((pi/180)*")
            .replace(/cos\(/g, "cos((pi/180)*")
            .replace(/tan\(/g, "tan((pi/180)*");
        }

        const currentResult = evaluate(correctedInput);

        if (prevResult !== "") {
          const newResult = evaluate(`${prevResult} ${correctedInput}`);
          setPrevResult(newResult);
          setInput(newResult.toString());
          setFullMathCalculation(`${prevResult} ${correctedInput} = ${newResult}`);
        } else {
          setPrevResult(currentResult);
          setInput(currentResult.toString());
          setFullMathCalculation(`${correctedInput} = ${currentResult}`);
        }
        setEqualsClicked(true);
      } catch (error) {
        setInput("Rechenfehler");
        setEqualsClicked(true);
      }
    }
  };

  // Button is reused for all calculator Buttons
  const renderButton = (
    value: React.ReactNode,
    onClick: () => void,
    span: number = 6,
    color: string = theming?.colors?.gray,
    fontSize: string = "2rem",
    TbAspectRatio: string = "auto",
    TbBackground: string = "auto"
  ) => (
    <Col span={span}>
      <Button size="middle" block onClick={onClick} style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: color, color: theming?.colors?.white, fontSize: fontSize, borderRadius: 100, height: "100%", aspectRatio: TbAspectRatio, background: TbBackground }}>
        <Flex justify="center" align="center">
          {value}
        </Flex>
      </Button>
    </Col>
  );

  useEffect(() => {
    const adjustFontSize = () => {
      if (textRef.current) {
        const textWidth = textRef.current.offsetWidth;
        if (textWidth > 400) {
          setFontSize((prevFontSize) => Math.max(1, prevFontSize - 0.1));
        } else {
          setFontSize(3.5);
        }
      }
    };

    adjustFontSize();
  }, [input, fullMathCalculation, prevResult]);


  return (
    <Flex style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Form size="small" style={{ width: "40vw", maxWidth: "550px", maxHeight: "90vh", padding: 30, borderRadius: "10px", backgroundColor: theming?.colors?.black, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Row gutter={[14, 14]}>
          <Col span={24}>
            <Row style={{ display: "flex", alignItems: "end", position: "relative" }}>
              {angleMode === "rad" ? (
                <Col style={{ position: "absolute", left: 0 }}>
                  <Text>
                    {angleMode.charAt(0).toUpperCase() + angleMode.slice(1)}
                  </Text>
                </Col>
              ) : null}

              <Col flex={1} style={{ textAlign: "right",   overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis" }}>
               <div
                  ref={textRef}
                  style={{
                    fontSize: `${fontSize}rem`,
                    color: theming?.colors?.white,
                    lineHeight: "1.2",
                    transition: "font-size 0.2s ease",
                  }} >
                  {prevResult !== "" ? fullMathCalculation.replace(/\*/g, "x") : input.replace(/\*/g, "x") || "0"}
                </div>
              </Col>
            </Row>
          </Col>
          {isScientific &&
            scientificSymbols.map((symbol) => (
              renderButton(symbol.label, () => handleClick(symbol.value), 4, theming?.colors?.gray, "1.4rem", "1", theming?.colors?.darkGray)
            ))}
          {renderButton(
            input && !equalsClicked ? <FaDeleteLeft /> : "AC",
            deleteLastOrDeleteAll,
            6,
            theming?.colors?.lightGray
          )}
          {renderButton("+/-", () => handleOperation("* (-1)"), 6, theming?.colors?.lightGray)}
          {renderButton("%", () => handleOperation("%"), 6, theming?.colors?.lightGray)}
          {renderButton("÷", () => handleOperation("/"), 6, theming?.colors?.orange)}
          {renderButton("7", () => handleClick("7"))}
          {renderButton("8", () => handleClick("8"))}
          {renderButton("9", () => handleClick("9"))}
          {renderButton("x", () => handleOperation("*"), 6, theming?.colors?.orange)}
          {renderButton("4", () => handleClick("4"))}
          {renderButton("5", () => handleClick("5"))}
          {renderButton("6", () => handleClick("6"))}
          {renderButton("-", () => handleOperation("-"), 6, theming?.colors?.orange)}
          {renderButton("1", () => handleClick("1"))}
          {renderButton("2", () => handleClick("2"))}
          {renderButton("3", () => handleClick("3"))}
          {renderButton("+", () => handleOperation("+"), 6, theming?.colors?.orange)}
          {renderButton(<FaCalculator />, () => showModal())}
          <Modal
            title={<Text style={{ color: theming?.colors?.orange }}>Taschenrechner Varianten</Text>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            style={{
              borderRadius: "50px",
            }}
            width={350}
            closeIcon={<IoMdClose color="white" />}
          >
            <Flex vertical gap={10}>
              <Button onClick={() => {
                setIsScientific(false)
                setIsModalOpen(false)
              }}>
                <TbMathSymbols /> Standard
              </Button>
              <Button onClick={() => {
                setIsScientific(true)
                setIsModalOpen(false)
              }}>
                <TbMathFunction /> Wissenschaftlich
              </Button>
            </Flex>

          </Modal>
          {renderButton("0", () => handleClick("0"))}
          {renderButton(".", () => handleClick("."))}
          {renderButton("=", equals, 6, theming?.colors?.orange)}
        </Row>
      </Form>
    </Flex>
  );
}