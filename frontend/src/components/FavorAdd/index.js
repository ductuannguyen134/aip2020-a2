import React, { useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "./style.css";
import { Button, IconButton, Input } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useHistory } from "react-router-dom";
import axios from "../../hoc/axios";

function FavorAdd(props) {
  const { handleAdd, onUpdate } = props;
  const [person, setPerson] = useState("");
  const [inputList, setInputList] = useState([{ name: "", quantity: "" }]);
  let history = useHistory();

  function handleChangePerson(e) {
    setPerson(e.target.value);
  }

  function handleInputChange(e, index) {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  }

  function handleRemoveInputField(index) {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  }

  function handleAddInputField() {
    setInputList([...inputList, { name: "", quantity: "" }]);
  }

  function cancel(e) {
    history.push("/favors");
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert("Submitted!");
    const favor = {
      ownerID: "5f862b953d152a307c75cd05",
      // debtorID: "5f864281a9213334cb6592ec",
      debtorID: "5f86ec1cec72c8517e88b13d",
      items: inputList,
    };

    console.log(favor);

    axios
      .post("/api/favor/create", favor)
      .then((res) => {
        console.log(res.data);
        handleAdd(favor);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="favorAdd">
      <h1>Add favor for you</h1>
      <div className="favorAdd__body">
        <div className="favorAdd__left">
          <div className="favorAdd__chooseFrom">
            <p>From: </p>
            <Select
              id="choosePerson"
              value={person}
              onChange={handleChangePerson}
              style={{ width: "20ch" }}
            >
              <MenuItem value="Chris">Chris</MenuItem>
              <MenuItem value="Hailey">Hailey</MenuItem>
              <MenuItem value="Duc">Duc</MenuItem>
              <MenuItem value="Thinh">Thinh</MenuItem>
            </Select>
          </div>

          {inputList.map((item, index) => {
            return (
              <div>
                <div className="favorAdd__chooseItems">
                  <p>Items: </p>
                  <Select
                    id="chooseItem"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    <MenuItem value="Chocolate">Chocolate</MenuItem>
                    <MenuItem value="Coffee">Coffee</MenuItem>
                    <MenuItem value="Candy">Candy</MenuItem>
                    <MenuItem value="Tea">Tea</MenuItem>
                  </Select>

                  <Input
                    className="favorAdd__itemNumber"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(e, index)}
                    inputProps={{
                      type: "number",
                      min: 0,
                      max: 100,
                    }}
                  />
                  {inputList.length !== 1 && (
                    <IconButton onClick={() => handleRemoveInputField(index)}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </div>
                {inputList.length - 1 === index && (
                  <IconButton onClick={handleAddInputField}>
                    <AddIcon />
                  </IconButton>
                )}
              </div>
            );
          })}
        </div>
        <div className="favorAdd__right">
          <div className="favorAdd__proof">
            <p>Proof Required</p>
            <Input inputProps={{ type: "file" }} />
          </div>
          <div className="favorAdd__buttons">
            <Button onClick={handleSubmit}>Create Favor</Button>
            <Button onClick={cancel}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavorAdd;
