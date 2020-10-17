import React, {useState, useEffect} from 'react';
import {Container, TextField, Button, ButtonGroup, IconButton, Dialog, DialogTitle} from '@material-ui/core';
import { Link, Route, Redirect, useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "./styles.css";

function DebtsLeaderboard() {
    const [debtLists, setDebtLists] = useState([]);

    useEffect(() =>{
        function createData(userName, requestNum) {
            return { userName, requestNum };
        }
          
        const data = [
            createData('tuan', 4),
            createData('duc', 3),
            createData('hailey', 1),
            createData('thinh',5),
            createData('tuan', 4),
            createData('duc', 3),
            createData('hailey', 1),
            createData('thinh',5),
            createData('tuan', 4),
            createData('duc', 3),
            createData('hailey', 1),
            createData('thinh',5),
            createData('tuan', 4),
            createData('duc', 3),
            createData('hailey', 1),
            createData('thinh',5)
        ];

        const rows = data.sort((a,b) => {
            return a.requestNum - b.requestNum;
        });

        setDebtLists(rows);
        console.log(rows);
    }, [])

    return (
        <div className="debtsboard">
            <div className="debtsboard-body">
                <div className="debtsboard__heading">
                    <h3>Users with the least debts</h3>
                </div>
                <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell align="right">Number of debts</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {debtLists.map((row) => (
                                    <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.userName}
                                    </TableCell>
                                    <TableCell align="right">{row.requestNum}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </div>
        </div>
    )
}

export default DebtsLeaderboard
