import React from "react";
import { Input } from "@material-ui/core";

const ImageUpload = (props) => (
  <div>
    <img src={props.url} alt={"Uploaded Image"} width={200} height={200} />
    <br />
    <Input inputProps={{ type: "file" }} onChange={props.onChange} />
  </div>
);

export default ImageUpload;
