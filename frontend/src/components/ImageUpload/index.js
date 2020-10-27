import React, { useState } from "react";
import { Button, Dialog, Input } from "@material-ui/core";

const ImageUpload = (props) => (
  <div>
    <img src={props.url} width={200} height={200} />
    <br />
    <Input inputProps={{ type: "file" }} onChange={props.onChange} />
  </div>
);

export default ImageUpload;
