import React, { useState } from "react";
import "./styles.css";
import { Button, IconButton, Input, ButtonGroup } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import axios from "../../hoc/axios";
import { useUserStatus } from "../../hoc/UserContext/UserContext";

function ResolveDebts(props) {
  const DEFAULT_IMG =
    "https://www.kenyons.com/wp-content/uploads/2017/04/default-image.jpg";
  const [{ user }, dispatch] = useUserStatus();
  const [url, setUrl] = useState(DEFAULT_IMG);
  const [img, setImg] = useState();
  const history = useHistory();

  const handleUpload = (event) => {
    setUrl(URL.createObjectURL(event.target.files[0]));
    setImg(event.target.files[0]);
  };

  const handleResolve = () => {
    if (img) {
      let imgUrl;

      const fd = new FormData();
      fd.append("image", img, img.name);

      axios
        .post("https://api.imgur.com/3/upload", fd, {
          headers: {
            Authorization: "Client-ID 2d41554ce8617a3",
          },
        })
        .then((res) => {
          imgUrl = res.data.data.link;
          axios
            .patch(
              `/api/favor/update/${props.debt._id}`,
              { img: imgUrl },
              {
                headers: {
                  Authorization: user.token,
                },
              }
            )
            .then(() => window.location.reload())
            .catch((err) => alert(err));
        })
        .catch((err) => alert(err));
    } else {
      alert("Please upload an image");
    }
  };

  return (
    <div className="debts-dialog">
      <DialogTitle id="alert-dialog-title">
        Please upload an image to resolve this debt
      </DialogTitle>
      <DialogContent>
        <img src={url} width={400} height={400} />
        <br />
        <Input
          inputProps={{ type: "file" }}
          onChange={(e) => handleUpload(e)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleResolve}>
          Resolve Debt
        </Button>
      </DialogActions>
    </div>
  );
}

export default ResolveDebts;
