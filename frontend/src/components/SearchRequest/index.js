import React from "react";
import { TextField } from "@material-ui/core";

const SearchRequest = (props) => (
  <div>
    <TextField
      value={props.searchContent}
      onChange={props.onChangeSearchContent}
      label="Search by keyword"
      margin="normal"
      variant="outlined"
      style={{marginRight: 50}}
    />

    <TextField
      value={props.searchReward}
      onChange={props.onChangeSearchReward}
      label="Search by reward"
      margin="normal"
      variant="outlined"
    />
  </div>
);

export default SearchRequest;
