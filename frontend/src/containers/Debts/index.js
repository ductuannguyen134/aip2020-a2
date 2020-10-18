import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  ButtonGroup,
  IconButton,
  Dialog,
  DialogTitle,
} from "@material-ui/core";
import { Link, Route, useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./styles.css";
import ResolveDebt from "../../components/ResolveDebt";
import DebtAdd from "../../components/DebtAdd";
import AddIcon from "@material-ui/icons/Add";
import axios from "../../hoc/axios";
import { useUserStatus } from "../../hoc/UserContext/UserContext";
import { useLoading } from "../../hoc/LoadingContext/LoadingContext";

function Debts() {
  const DEFAULT_IMG =
    "https://www.kenyons.com/wp-content/uploads/2017/04/default-image.jpg";
  const [isComplete, setIsComplete] = useState(false);
  const [debtList, setDebtList] = useState([]);
  const [{ user }, dispatch] = useUserStatus();
  const [loading, setLoading] = useLoading();
  const [openResolve, setOpenResolve] = useState(false);
  const [selectDebt, setSelectDebt] = useState();
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/api/favor/debt", {
        headers: {
          Authorization: user.token,
        },
      });

      setDebtList(response.data);
    }
    setLoading((prev) => !prev);
    fetchData();
    setLoading((prev) => !prev);
  }, []);

  let history = useHistory();

  return (
    <div className="debts">
      <Container fixed style={{ backgroundColor: "#ffffff", padding: 50 }}>
        <div className="favor__heading">
          <h1>Your Debts</h1>

          <IconButton
            onClick={() => {
              setOpenAdd(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
        <div className="debts-body">
          <TableContainer component={Paper}>
            <Table className="table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Favors</TableCell>
                  <TableCell align="right">To</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Initial Proof</TableCell>
                  <TableCell align="right">Resolved Proof</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debtList.length > 0 ? (
                  debtList.map((favor) => (
                    <TableRow key={favor._id}>
                      <TableCell component="th" scope="row">
                        <p>
                          {favor.items.map((item) => (
                            <span>
                              {item.quantity} {item.id.prize}{" "}
                            </span>
                          ))}
                        </p>
                      </TableCell>
                      <TableCell align="right">
                        {favor.ownerID.userName}
                      </TableCell>
                      <TableCell align="right">
                        {favor.isComplete ? "COMPLETED" : "UNCOMPLETED"}
                      </TableCell>
                      <TableCell align="right">
                        <img
                          src={
                            favor.createdImage
                              ? favor.createdImage
                              : DEFAULT_IMG
                          }
                          width={100}
                          height={100}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <img
                          src={
                            favor.completedImage
                              ? favor.completedImage
                              : DEFAULT_IMG
                          }
                          width={100}
                          height={100}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {!favor.isComplete && (
                          <ButtonGroup
                            variant="contained"
                            color="primary"
                            aria-label="contained primary button group"
                          >
                            <Button
                              onClick={() => {
                                setOpenResolve(true);
                                setSelectDebt(favor);
                              }}
                            >
                              Resolve
                            </Button>
                          </ButtonGroup>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                      No debt has been added
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>

      <Dialog
        maxWidth="lg"
        open={openResolve}
        onClose={() => {
          setOpenResolve(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <ResolveDebt
          debt={selectDebt}
          onResolve={() => {
            setOpenResolve(false);
          }}
        />
      </Dialog>

      <Dialog
        maxWidth="lg"
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DebtAdd
          onAdd={() => {
            setOpenAdd(false);
          }}
        />
      </Dialog>
    </div>
  );
}

export default Debts;
