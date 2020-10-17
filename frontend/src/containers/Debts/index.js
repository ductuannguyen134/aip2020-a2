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
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { useUserStatus } from "../../hoc/UserContext";

function Debts() {
  const [isComplete, setIsComplete] = useState(false);
  const [{ user }, dispatch] = useUserStatus();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/api/favor/debt", {
        headers: {
          Authorization: user.token,
        },
      });

      console.log(response);
    }

    fetchData();
  }, []);

  function createData(favors, to, status, initialProof, resolvedProof) {
    return { favors, to, status, initialProof, resolvedProof };
  }

  const rows = [
    createData(
      ["clean the table, wash the car"],
      "Tuan",
      true,
      "abc.jpg",
      "syx.jpg"
    ),
    createData(["clean the fridge"], "Duc", false, "abc1.jpg", "syx1.jpg"),
    createData(
      ["Wash the dish, Fix the door"],
      "Hailey",
      false,
      "abc2.jpg",
      "syx2.jpg"
    ),
    createData(["Wash the car"], "Thinh", true, "abc3.jpg", "syx3.jpg"),
  ];

  function handleClickOpen(e) {
    setOpen(true);
  }

  function handleClose(e) {
    setOpen(false);
    history.push("/debts");
  }

  const [open, setOpen] = useState(false);
  let history = useHistory();

  return (
    <div className="debts">
      <Container fixed style={{ backgroundColor: "#ffffff", padding: 50 }}>
        <div className="favor__heading">
          <h1>Your Debts</h1>
          <IconButton onClick={handleClickOpen}>
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
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.favors}
                    </TableCell>
                    <TableCell align="right">{row.to}</TableCell>
                    <TableCell align="right">
                      {row.status ? "Completed" : "Uncompleted"}
                    </TableCell>
                    <TableCell align="right">{row.initialProof}</TableCell>
                    <TableCell align="right">{row.resolvedProof}</TableCell>
                    <TableCell align="right">
                      {!row.status && (
                        <Link to="/debts/resolve">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                          >
                            Resolve
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>

      {/* Route to resolve debts */}
      <Route path="/debts/resolve">
        <Dialog
          maxWidth="lg"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <ResolveDebt />
        </Dialog>
      </Route>
    </div>
  );
}

export default Debts;
