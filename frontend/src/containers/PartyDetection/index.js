import React, { useState, useEffect } from "react";
import {Container, TextField, Button, ButtonGroup} from '@material-ui/core';
import { Link, Route, useHistory } from 'react-router-dom';
import axios from "../../hoc/axios";
import {useUserStatus} from '../../hoc/UserContext/UserContext';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useLoading } from "../../hoc/LoadingContext/LoadingContext";
// import "./styles.css";
import Graph from "graph.js";

function PartyDetection() {
    const [loading, setLoading] = useLoading();
    const user = useUserStatus();
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [favors, setFavors] = useState([]);
    const graph = new Graph();

    useEffect(() => {
    
    const getUsersList = async () => {
    const res = await axios.get("/api/user/users");
    setUsers(res.data);
    };

    const getFavorsList = async () => {
      const res = await axios.get("/api/favor/uncompleted");
      setFavors(res.data);
    };

    setLoading((prev) => !prev);
    
    getUsersList();
    getFavorsList();
    setLoading((prev) => !prev);
  }, []);

  const Party = () => {
    try
    {
        users.forEach((user) => graph.addVertex(user.userName));
        favors.forEach((favor) => graph.addEdge(favor.debtorID.userName, favor.ownerID.userName));
        // console.log(graph);
        let parties = []; // all parties
        for (let cycle of graph.cycles()) {
        let partyUsers = []; //all users of 1 specific party
        // Only include cycle that has more than 2 people
            if (cycle.length > 2)
            {
                // console.log(cycle);
                cycle.forEach((user) => {
                    partyUsers.push(user);
                });
                parties.push(partyUsers);
            }
        }
        return parties;
        // const cycles = graph.cycles();
        // console.log(cycles);
        // Array.from(cycles).map(([key,cycle]) => {
        //             // if (cycle.length > 2 && cycle.includes(user.userName))
        //     if (cycle.length > 2 )
        //     {
        //         cycle.forEach((user) => {
        //         text += user + " " ;
        //         });
        //     }
        // });
    }
    catch (error){};
    }

    return (
          <div>
             <Container fixed style={{backgroundColor: '#ffffff', padding: 50}}>
                <h1>Parties Detected</h1>
                    <TableContainer component={Paper}>
          <Table className="table" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Party Number</TableCell>
                <TableCell align="center">Users</TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
                {Party().map((party, index) => (
                    <TableRow key={index}>
                          <TableCell align="left">{index+1}</TableCell>
                         <TableCell align="center" component="th" scope="row">
                        <p>
                          {party.map((partyUser) => (
                            <span>
                              {partyUser}{" "}
                            </span>
                          ))}
                        </p>
                      </TableCell>
                    </TableRow>))}
           
            </TableBody>
          </Table>
        </TableContainer>
            </Container>
        </div>
    )
}

export default PartyDetection;
