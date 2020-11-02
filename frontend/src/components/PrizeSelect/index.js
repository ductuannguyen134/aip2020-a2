import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton, Input } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const PrizeSelect = (props) => {
  return (
    <div>
      <div>
        {props.items.map((item, index) => (
          <div className="req-chooseitem" key={index}>
            <Select
              id="chooseItem"
              value={item.id}
              onChange={(e) => props.handleChangeItem(e.target.value, index)}
            >
              {props.prizes.map((prize) => (
                <MenuItem value={prize["_id"]}>{prize["prize"]}</MenuItem>
              ))}
            </Select>
            <Input
              style={{ minWidth: "10px" }}
              className="req-chooseItemNum"
              value={item.quantity}
              onChange={(e) => props.handleChangeItemNum(e.target.value, index)}
              inputProps={{
                type: "number",
                min: 1,
                max: 10,
              }}
            />
            {props.items.length > 1 && (
              <IconButton onClick={() => props.handleRemoveItem(index)}>
                <RemoveIcon />
              </IconButton>
            )}
          </div>
        ))}
      </div>
      {props.items.length === props.prizes.length ? null : (
        <IconButton onClick={props.handleAddItem}>
          <AddIcon />
        </IconButton>
      )}
    </div>
  );
};

export default PrizeSelect;
