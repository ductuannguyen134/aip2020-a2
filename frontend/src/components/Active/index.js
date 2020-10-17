import React, {useEffect, useState} from 'react';
import './styles.css';
import {Container, TextField, Button, ButtonGroup, IconButton, Dialog, DialogTitle} from '@material-ui/core';
import { Link, Route, Redirect, useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function Active() {

    const [activeLists, setActiveLists] = useState([]);

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
            return b.requestNum - a.requestNum;
        });

        setActiveLists(rows);
        console.log(rows);
    }, [])

    return (
        <div className="activeboard">
            <div className="activeboard-body">
                <div className="activeboard__heading">
                    <h3>Most Active Users</h3>
                </div>
                <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell align="right">Number of resolved requests</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeLists.map((row) => (
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

export default Active
