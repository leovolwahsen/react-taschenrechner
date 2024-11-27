import React from "react";
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

  const scientificSymbols = [
    { label: "(", value: "(" },
    { label: ")", value: ")" },
    { label: "mc", value: "mc" },
    { label: "m+", value: "m+" },
    { label: "m-", value: "m-" },
    { label: "mr", value: "mr" },
    { label: "2ⁿᵈ", value: "2ⁿᵈ" },
    { label: "x²", value: "x²" },
    { label: "x³", value: "x³" },
    { label: "xʸ", value: "xʸ" },
    { label: "eˣ", value: "eˣ" },
    { label: "10ˣ", value: "10ˣ" },
    { label: "1/x", value: "1/x" },
    { label: "2√x", value: "2√x" },
    { label: "3√x", value: "3√x" },
    { label: "y√x", value: "y√x" },
    { label: "In", value: "In(" },
    { label: "log₁₀", value: "log₁₀" },
    { label: "x!", value: "x!" },
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "e", value: "e" },
    { label: "EE", value: "EE" },
    { label: "Rand", value: "Rand" },
    { label: "sinh", value: "sinh(" },
    { label: "cosh", value: "cosh(" },
    { label: "tanh", value: "tanh(" },
    { label: "π", value: "pi" },
    { label: "Rad", value: "Rad" },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClick = (value: string): void => {
    if (equalsClicked) {
      setInput(value);
      setEqualsClicked(false);
    } else {
      setInput(input + value);
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
  };

  const renderButton = (
    value: React.ReactNode,
    onClick: () => void,
    span: number = 6,
    color: string = theming?.colors?.gray
  ) => (
    <Col span={span}>
      <Button size="large" block onClick={onClick} style={{ backgroundColor: color, color: theming?.colors?.white, padding: "2rem", fontSize: "2rem" }}>
        {value}
      </Button>
    </Col>
  )

  return (
    <Flex style={{ height: "100%", backgroundColor: theming?.colors?.lightGray }}>
      <Form size="large" style={{ margin: "10rem 45rem 20rem", padding: 30, background: theming?.colors?.black, borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Row gutter={[18, 18]}>
          <Col span={24}>
            <Text type="secondary" style={{ color: theming?.colors?.white, fontSize: "2rem" }}>
              {prevResult !== "" ? fullMathCalculation.replace(/\*/g, "x") : input.replace(/\*/g, "x") || "0"}
            </Text>
          </Col>
          {isScientific && 
          scientificSymbols.map((symbol) => (
            renderButton(symbol.label, () => handleClick(symbol.value), 6)
          ))}
          {renderButton(
            input && !equalsClicked ? <FaDeleteLeft /> : "AC",
            deleteLastOrDeleteAll,
            6,
            theming?.colors?.lightGray
          )}
          {renderButton("%", () => handleOperation("%"), 6, theming?.colors?.orange)}
          {renderButton("/", () => handleOperation("/"), 6, theming?.colors?.orange)}
          {renderButton(<IoMdClose />, () => handleOperation("*"), 6, theming?.colors?.orange)}
          {renderButton("7", () => handleClick("7"))}
          {renderButton("8", () => handleClick("8"))}
          {renderButton("9", () => handleClick("9"))}
          {renderButton("-", () => handleOperation("-"), 6, theming?.colors?.orange)}
          {renderButton("4", () => handleClick("4"))}
          {renderButton("5", () => handleClick("5"))}
          {renderButton("6", () => handleClick("6"))}
          {renderButton("+", () => handleOperation("+"), 6, theming?.colors?.orange)}
          {renderButton("1", () => handleClick("1"))}
          {renderButton("2", () => handleClick("2"))}
          {renderButton("3", () => handleClick("3"))}
          {renderButton("=", equals, 6, theming?.colors?.orange)}
          {renderButton(<FaCalculator />, () => showModal())}
          <Modal
            title={<Text style={{ color: theming?.colors?.orange }}>Taschenrechner Varianten</Text>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            style={{
              borderRadius: "5px",
            }}
            width={350}
            closeIcon={<IoMdClose color="white" />}
          >
            <Flex vertical gap={10}>
              <Button onClick={() => {
                setIsScientific(false);
              }}>
                <TbMathSymbols /> Standard
              </Button>
              <Button onClick={() => {
                setIsScientific(true);
              }}>
                <TbMathFunction /> Wissenschaftlich
              </Button>
            </Flex>

          </Modal>
          {renderButton("0", () => handleClick("0"))}
          {renderButton(".", () => handleClick("."))}
        </Row>
      </Form>
    </Flex>
  );
}