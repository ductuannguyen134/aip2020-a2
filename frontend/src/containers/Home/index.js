import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  ButtonGroup,
  IconButton,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import { useUserStatus } from "../../hoc/UserContext/UserContext";
import AddIcon from "@material-ui/icons/Add";
import "./style.css";
import axios from "../../hoc/axios";
import RequestAdd from "../../components/RequestAdd";
import PrizeAdd from "../../components/PrizeAdd";
import ResolveModal from "../../components/ResolveModal";
import { useLoading } from "../../hoc/LoadingContext/LoadingContext";
import { ACTIONS } from "../../hoc/UserContext/reducer";
import TablePagination from "@material-ui/core/TablePagination";
import SearchRequest from "../../components/SearchRequest";

const Home = (props) => {
  const [{ user }, dispatch] = useUserStatus();
  const [requests, setRequests] = useState([]);
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [openAddRw, setOpenAddRw] = useState(false);
  const [openResolve, setOpenReolve] = useState(false);
  const [selectRequest, setSelectRequest] = useState();
  const [loading, setLoading] = useLoading();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchReward, setSearchReward] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/api/request/")
        .then((response) => {
          setRequests(response.data);
        })
        .catch((error) => {
          alert(error);
        });
    };

    const verifyUser = async () => {
      try {
        const response = await axios.get("/api/user/verify", {
          headers: {
            Authorization: user.token,
          },
        });
      } catch (err) {
        if (err) {
          alert("Your session is timeout. Please login again");
          logout();
        }
      }
    };

    setLoading((prev) => !prev);
    fetchData();
    if (user) {
      verifyUser();
    }
    setLoading((prev) => !prev);
  }, []);

  const logout = () => {
    dispatch({
      type: ACTIONS.SET_USER,
      user: null,
    });
    history.push("/");
  }

  const handleClickOpen = () => {
    if (user) {
      setOpen(true);
    } else {
      history.push("/login");
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await axios.delete(`/api/request/delete/${id}`, {
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
          if (user) {
            setOpenReolve(true);
            setSelectRequest(request);
          } else {
            history.push(!user && "/login");
          }
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
      onClick={() => {
        if (window.confirm("Are you sure to delete this record?")) {
          handleDeleteClick(id);
        }
      }}
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchContent = (query) => {
    setSearchContent(query);
    let searchValue = query.trim().toLowerCase();
    if (searchValue.length > 0) {
      let searchResults = requests.filter((request) =>
        request.requestContent.toLowerCase().includes(searchValue)
      );
      setSearchResults(searchResults);
    } else {
      setSearchResults(null);
    }
  };

  const handleSearchReward = (query) => {
    setSearchReward(query);
    let searchValue = query.trim().toLowerCase();
    if (searchValue.length > 0) {
      let searchResults = requests.filter((request) =>
        request.requestFavors.some((favor) =>
          favor.rewards.some((reward) =>
            reward.id.prize.toLowerCase().includes(searchValue)
          )
        )
      );
      setSearchResults(searchResults);
    } else {
      setSearchResults(null);
    }
  };

  let requestList = requests;
  if (searchResults) {
    requestList = searchResults; //If search results exists, render that list instead
  }

  return (
    <div className="home">
      <div className="home__data">
        <Container fixed style={{ backgroundColor: "#ffffff", padding: 50 }}>
          <div className="request__add">
            <h1>Active public requests</h1>
            <IconButton onClick={handleClickOpen}>
              <AddIcon />
            </IconButton>
            <SearchRequest
              searchContent={searchContent}
              onChangeSearchContent={(event) =>
                handleSearchContent(event.target.value)
              }
              searchReward={searchReward}
              onChangeSearchReward={(event) =>
                handleSearchReward(event.target.value)
              }
            />
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table className="table" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Requests</TableCell>
                    <TableCell align="right">Rewards</TableCell>
                    <TableCell align="right">From</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestList.length > 0 ? (
                    requestList
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((request) => (
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
                                  ? favor.from["_id"] !== user.userID
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
                      ))
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={12}>
                        No{" "}
                        {searchResults
                          ? "search results"
                          : "active request has been added"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 100]}
              component="div"
              count={requests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </div>
        </Container>

        {/* Pop up add request */}
        {open && (
          <RequestAdd
            open={open}
            handleClose={() => {
              setOpen(false);
              history.push("/");
            }}
            prizes={props.prizes}
          />
        )}

        {/* Pop up add reward */}
        {openAddRw && (
          <PrizeAdd
            request={selectRequest}
            handleClose={() => {
              setOpenAddRw(false);
              history.push("/");
            }}
            openAddRw={openAddRw}
            prizes={props.prizes}
          />
        )}

        {/* Pop up resolve */}
        {openResolve && (
          <ResolveModal
            request={selectRequest}
            onResolve={() => setOpenReolve(false)}
            onClose={() => {
              setOpenReolve(false);
              history.push("/");
            }}
            open={openResolve}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
