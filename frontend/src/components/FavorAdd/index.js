import React, { useState, useEffect } from "react";
import "./style.css";
import { Button } from "@material-ui/core";
import axios, { axiosImgur } from "../../hoc/axios";
import { useUserStatus } from "../../hoc/UserContext/UserContext";
import { useLoading } from "../../hoc/LoadingContext/LoadingContext";
import PrizeSelect from "../../components/PrizeSelect";
import PersonSelect from "../../components/PersonSelect";
import ImageUpload from "../../components/ImageUpload";

const DEFAULT_IMG =
  "https://www.kenyons.com/wp-content/uploads/2017/04/default-image.jpg";

const FavorAdd = (props) => {
  const [{ user }, dispatch] = useUserStatus();
  const [loading, setLoading] = useLoading();
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([{ id: "", quantity: 1 }]);
  const [person, setPerson] = useState();
  const [img, setImg] = useState(DEFAULT_IMG);
  const [proof, setProof] = useState();

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

  const handleChangePerson = (e) => {
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

  const handleUpload = (event) => {
    setImg(URL.createObjectURL(event.target.files[0]));
    setProof(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    if (!person || (items.length == 1 && items[0].id == "") || !proof) {
      alert("Please insert all fields");
    } else {
      props.onFavorAdd();
      setLoading((prev) => !prev);
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
            ownerID: user.userID,
            debtorID: person,
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
    }
  }

  return (
    <div className="favorAdd">
      <h1>Add favor for you</h1>
      <p style={{ color: "red" }}>All fields are required</p>
      <div className="favorAdd__body">
        <div className="favorAdd__left">
          <div className="favorAdd__chooseFrom">
            <p>From: </p>
            <PersonSelect
              person={person}
              handleChangePerson={handleChangePerson}
              users={users}
            />
          </div>
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
        <div className="favorAdd__right">
          <div className="favorAdd__proof">
            <p>Proof</p>
            <ImageUpload url={img} onChange={handleUpload} />
          </div>
          <div className="favorAdd__buttons">
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Create Favor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavorAdd;
