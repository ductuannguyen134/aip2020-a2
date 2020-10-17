import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  ButtonGroup,
  IconButton,
  Dialog,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Link, Route, useHistory } from "react-router-dom";
import { useUserStatus } from "../../hoc/UserContext";
import AddIcon from "@material-ui/icons/Add";
import "./style.css";
import axios from "../../hoc/axios";
import RequestAdd from "../../components/RequestAdd";
import PrizeAdd from "../../components/PrizeAdd";

function Home() {
  const [{ user }, dispatch] = useUserStatus();
  const [requests, setRequests] = useState([]);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [openAddRw, setOpenAddRw] = useState(false);
  const [selectRequest, setSelectRequest] = useState();

  useEffect(() => {
    async function fetchData() {
      await axios
        .get("/api/request/")
        .then((response) => {
          setRequests(response.data);
        })
        .catch((error) => {
          alert(error);
        });
    }
    fetchData();
  }, []);

  const handleClickOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      history.push("/login");
    }
  };

  const handleClose = () => {
    setOpen(false);
    history.push("/");
  };

  const handleDeleteClick = async (id) => {
    let res;
    try {
      res = await axios.delete(`/api/request/delete/${id}`, {
        headers: {
          Authorization: user.token,
        },
      });
    } catch (err) {
      console.log(err);
    }

    window.location.reload();
  };

  const buttonGroup = (request) => (
    <ButtonGroup aria-label="contained primary button group">
      <Button
        variant="contained"
        color="default"
        onClick={() => {
          if (user) {
            setOpenAddRw(true);
            setSelectRequest(request);
          } else {
            history.push(!user && "/login");
          }
        }}
      >
        Add Rewards
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          history.push(!user && "/login");
        }}
      >
        Resolve
      </Button>
    </ButtonGroup>
  );

  const buttonDelete = (id) => (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => handleDeleteClick(id)}
    >
      Delete
    </Button>
  );

  const verifyUser = (id, array) => {
    let temp = 0;
    array.forEach((element) => {
      if (id === element.from["_id"]) {
        temp += 1;
        return;
      }
    });
    return temp > 0 ? true : false;
  };

  return (
    <div className="home">
      <div className="home__data">
        <Container fixed style={{ backgroundColor: "#ffffff", padding: 50 }}>
          <div className="request__add">
            <h1>Active public requests</h1>
            <IconButton onClick={handleClickOpen}>
              <AddIcon />
            </IconButton>
            <span>(Create Request)</span>
          </div>
          <TableContainer component={Paper}>
            <Table className="table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Requests</TableCell>
                  <TableCell align="right">Rewards</TableCell>
                  <TableCell align="right">From</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell component="th" scope="row">
                      {request.requestContent}
                    </TableCell>
                    <TableCell align="right">
                      {request.requestFavors.map((favor) => (
                        <p>
                          {favor.rewards.map((reward) => (
                            <span>
                              {reward.quantity} {reward.id.prize}{" "}
                            </span>
                          ))}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      {request.requestFavors.map((favor) => (
                        <p>
                          {user
                            ? favor.from["_id"] != user.userID
                              ? favor.from.userName
                              : "You"
                            : favor.from.userName}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      {!user
                        ? buttonGroup(request)
                        : verifyUser(user.userID, request.requestFavors)
                        ? buttonDelete(request["_id"])
                        : buttonGroup(request)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        {/* Pop up add request */}
        <Dialog
          maxWidth="lg"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <RequestAdd />
        </Dialog>
        <Dialog
          open={openAddRw}
          onClose={() => {
            setOpenAddRw(false);
            history.push("/");
          }}
        >
          <PrizeAdd request={selectRequest} />
        </Dialog>
      </div>
    </div>
  );
}

export default Home;
