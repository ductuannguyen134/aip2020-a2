import React, { useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const PersonSelect = (props) => (
  <Select
    id="choosePerson"
    value={props.person}
    onChange={props.handleChangePerson}
    style={{ width: "20ch" }}
  >
    {props.users.map((user, index) => (
      <MenuItem value={user["_id"]} key={index}>
        {user["userName"]}
      </MenuItem>
    ))}
  </Select>
);

export default PersonSelect;
