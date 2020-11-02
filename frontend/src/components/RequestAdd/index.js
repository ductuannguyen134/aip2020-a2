import React, { useState } from "react";
import "./styles.css";
import { Button, Dialog } from "@material-ui/core";
import axios from "../../hoc/axios";
import { useUserStatus } from "../../hoc/UserContext/UserContext";
import PrizeSelect from "../../components/PrizeSelect";

const RequestAdd = (props) => {
  const [{ user }, dispatch] = useUserStatus();
  const [request, setRequest] = useState();
  const [items, setItems] = useState([{ id: "", quantity: 1 }]);

  const handleAddItem = () => {
    if (items.length < props.prizes.length) {
      setItems([...items, { id: "", quantity: 1 }]);
    } else {
      alert("Cant add more type of reward");
    }
  };

  const handleChangeItem = (item, index) => {
    if (items.length > 1 && items.findIndex((val) => val.id == item) != -1) {
      alert("Cannot select the same type of prize");
    } else {
      const list = [...items];
      list[index].id = item;
      setItems(list);
    }
  };

  const handleChangeItemNum = (quantity, index) => {
    const list = [...items];
    list[index].quantity = quantity;
    setItems(list);
  };

  const handleRemoveItem = (index) => {
    const list = [...items];
    list.splice(index, 1);
    setItems(list);
  };

  const addRequest = async () => {
    if (user) {
      if ((items.length == 1 && items[0].id == "") || !request) {
        alert("All fields must be filled in!");
      } else {
        const request_params = {
          requestContent: request,
          requestFavors: [
            {
              from: user.userID,
              rewards: [...items],
            },
          ],
          resolverID: null,
          resolverProof: null,
        };

        await axios
          .post("/api/request/create", request_params, {
            headers: {
              Authorization: user.token,
            },
          })
          .then((response) => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      alert("You must log in again to add a request!");
    }
  };

  return (
    <Dialog
      maxWidth="lg"
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <div className="req-dialog">
        <div className="req-dialog-content">
          <h1>Add a new request</h1>
          <div className="req-dialog-request">
            <div className="req-dialog-request text">
              <p>
                Request: <span style={{ color: "red" }}>(Required)</span>
              </p>
            </div>
            <div className="req-dialog-request-input">
              <textarea
                onChange={(e) => setRequest(e.target.value)}
                value={request}
                rows="4"
                cols="50"
              ></textarea>
            </div>
          </div>
          <div className="req-dialog-reward">
            <div className="req-dialog-reward text">
              <p>
                Rewards: <span style={{ color: "red" }}>(Required)</span>
              </p>
            </div>
            <div className="widgets">
              <p>Items: </p>
              <PrizeSelect
                items={items}
                prizes={props.prizes}
                handleChangeItem={handleChangeItem}
                handleChangeItemNum={handleChangeItemNum}
                handleRemoveItem={handleRemoveItem}
                handleAddItem={handleAddItem}
              />
            </div>
          </div>
          <div className="req-button">
            <Button onClick={addRequest} color="primary" variant="contained">
              Create Request
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default RequestAdd;
