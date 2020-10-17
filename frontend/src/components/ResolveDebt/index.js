import React, {useState} from 'react';
import "./styles.css";
import { Button, IconButton, Input, ButtonGroup } from "@material-ui/core";
import { useHistory } from "react-router-dom";

function ResolveDebts() {

    const DEFAULT_IMG =
     "https://www.kenyons.com/wp-content/uploads/2017/04/default-image.jpg";

    const [url, setUrl] = useState(DEFAULT_IMG);
    const [img, setImg] = useState();
    const history = useHistory();

    const handleUpload = (event) => {
      setUrl(URL.createObjectURL(event.target.files[0]));
      setImg(event.target.files[0]);
    };

    const cancel = () => {
        history.push('/debts');
    }

    const handleResolve = () => {
        console.log({url})
    }

    return (
        <div className="debts-dialog">
            <h1>You owns ...</h1>
            <img src={url} width={400} height={400} />
            <Input inputProps={{ type: "file" }} onChange={(e) => handleUpload(e)} />
            <ButtonGroup>
                <Button variant="contained" color="primary" onClick={handleResolve}>Resolve Debt</Button>
                <Button variant="contained" color="secondary" onClick={cancel}>Cancel</Button>
            </ButtonGroup>
        </div>
    )
}

export default ResolveDebts
