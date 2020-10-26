import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Button, IconButton, Input, Dialog } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import axios from "../../hoc/axios";
import { useUserStatus } from "../../hoc/UserContext/UserContext";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { useHistory } from "react-router-dom";
import PrizeSelect from "../PrizeSelect";

const PrizeAdd = (props) => {
  const content = props.request.requestContent;
  const history = useHistory();

  const [{ user }, dispatch] = useUserStatus();
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

  const addPrize = () => {
    if (user) {
      let res;
      try {
        axios.patch(
          `/api/request/update/${props.request._id}`,
          { rewards: [...items] },
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      } catch (err) {
        alert(err);
      }
    } else {
      history.push(!user && "/login");
    }

    window.location.reload();
  };

  return (
    <Dialog open={props.openAddRw} onClose={props.handleClose}>
      <div style={{ minWidth: 500 }}>
        <DialogTitle id="alert-dialog-title">
          <b>Request:</b> {content}
        </DialogTitle>
        <DialogContent>
          <p>Items: </p>
          <PrizeSelect
            items={items}
            prizes={props.prizes}
            handleChangeItem={handleChangeItem}
            handleChangeItemNum={handleChangeItemNum}
            handleRemoveItem={handleRemoveItem}
            handleAddItem={handleAddItem}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addPrize} color="primary" variant="contained">
            Add rewards
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default PrizeAdd;
