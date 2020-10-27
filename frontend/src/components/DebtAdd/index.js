import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "./style.css";
import { Button, IconButton, Input } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useHistory } from "react-router-dom";
import axios, { axiosImgur } from "../../hoc/axios";
import { useUserStatus } from "../../hoc/UserContext/UserContext";
import { useLoading } from "../../hoc/LoadingContext/LoadingContext";
import PrizeSelect from "../../components/PrizeSelect";
import PersonSelect from "../../components/PersonSelect";
import ImageUpload from "../../components/ImageUpload";

const DEFAULT_IMG =
  "https://www.kenyons.com/wp-content/uploads/2017/04/default-image.jpg";

function DebtAdd(props) {
  const [{ user }, dispatch] = useUserStatus();
  const [loading, setLoading] = useLoading();
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([{ id: "", quantity: 1 }]);
  const [person, setPerson] = useState();
  const [img, setImg] = useState(DEFAULT_IMG);
  const [proof, setProof] = useState();
  let history = useHistory();

  useEffect(() => {
    const getUsersList = async () => {
      const res = await axios.get("/api/user/users");
      const data = res.data;

      //REMOVE my ID
      const myID = user.userID;
      const idx = data.findIndex((user, index) => user["_id"] == myID);

      const list = [...data];
      list.splice(idx, 1);

      setUsers(list);
    };

    getUsersList();
  }, []);

  function handleChangePerson(e) {
    setPerson(e.target.value);
  }

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

  function cancel(e) {
    history.push("/debts");
  }

  const handleUpload = (event) => {
    setImg(URL.createObjectURL(event.target.files[0]));
    setProof(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (!person || (items.length == 1 && items[0].id == "")) {
      alert("Please insert all required fields");
    } else {
      props.onAdd();
      setLoading((prev) => !prev);
      if (proof) {
        let createdImage;

        const fd = new FormData();
        fd.append("image", proof, proof.name);

        axiosImgur
          .post("/https://api.imgur.com/3/upload", fd, {
            headers: {
              Authorization: "Client-ID 7f36d9bcba410e6",
              mode: "cors",
            },
          })
          .then((res) => {
            createdImage = res.data.data.link;
            const params = {
              ownerID: person,
              debtorID: user.userID,
              items: [...items],
              createdImage: createdImage,
            };

            axios
              .post("/api/favor/create", params, {
                headers: {
                  Authorization: user.token,
                },
              })
              .then(() => {
                setLoading((prev) => !prev);
                window.location.reload();
              })
              .catch((err) => {
                setLoading((prev) => !prev);
                alert(err);
              });
          })
          .catch((err) => {
            setLoading((prev) => !prev);
            alert(err);
          });
      } else {
        const params = {
          ownerID: person,
          debtorID: user.userID,
          items: [...items],
        };

        axios
          .post("/api/favor/create", params, {
            headers: {
              Authorization: user.token,
            },
          })
          .then(() => {
            setLoading((prev) => !prev);
            window.location.reload();
          })
          .catch((err) => {
            setLoading((prev) => !prev);
            alert(err);
          });
      }
    }
  };

  return (
    <div className="favorAdd">
      <h1>Add debt of you</h1>
      <div className="favorAdd__body">
        <div className="favorAdd__left">
          <div className="favorAdd__chooseFrom">
            <p>
              To: <span style={{ color: "red" }}>(Required)</span>
            </p>
            <PersonSelect
              person={person}
              handleChangePerson={handleChangePerson}
              users={users}
            />
          </div>
          <p>
            Items: <span style={{ color: "red" }}>(Required)</span>
          </p>
          <PrizeSelect
            items={items}
            prizes={props.prizes}
            handleChangeItem={handleChangeItem}
            handleChangeItemNum={handleChangeItemNum}
            handleRemoveItem={handleRemoveItem}
            handleAddItem={handleAddItem}
          />
        </div>
        <div className="favorAdd__right">
          <div className="favorAdd__proof">
            <p>Proof (Optional)</p>
            <ImageUpload url={img} onChange={handleUpload} />
          </div>
          <div className="favorAdd__buttons">
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Create Debt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebtAdd;
