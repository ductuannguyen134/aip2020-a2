import React, { useState, useEffect } from 'react';
import {Container, TextField, Button, ButtonGroup, IconButton} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link, Route, useHistory } from 'react-router-dom';
import {useUserStatus} from '../../hoc/UserContext';
import AddIcon from '@material-ui/icons/Add';
import './style.css';
import axios from '../../hoc/axios';

function Home() {

    const [{user},dispatch] = useUserStatus();
    const [requests, setRequests] = useState([]);
    const history = useHistory();
    
    useEffect( async () => {
        await axios.get("/api/request/").then((response)=>{
            console.log(response);
            setRequests(response.data);            
        }).catch((error)=>{
            console.log(error);
        })
    }, []);
        
    const data = [requests];
    console.log(data);

    return (
        <div className="home">
            <div className="home__data">
                <Container fixed style={{backgroundColor: '#ffffff', padding: 50}}>
                    <div className="request__add">
                        <h1>Public requests</h1>
                        <IconButton>
                            <AddIcon />
                        </IconButton>    
                    </div>
                    <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Requests</TableCell>
                                <TableCell align="right">From</TableCell>
                                <TableCell align="right">Rewards</TableCell>
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
                                    {
                                        request.requestFavors.map((favor)=>(
                                            <>
                                                <p>{favor.from}</p>
                                            </>
                                        ))
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    {
                                        request.requestFavors.map((favor)=>(
                                            <>
                                                <p>{favor.rewards.map((reward)=>(
                                                    <>
                                                        <p>{reward.name}: {reward.quantity} from {favor.from}</p>
                                                    </>
                                                ))}</p>
                                            </>
                                        ))
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <ButtonGroup  aria-label="contained primary button group">
                                            <Button variant="contained" color="primary" onClick={()=>{history.push( !user && "/login")}}>Add Favor</Button>
                                            <Button variant="contained" color="secondary" onClick={()=>{history.push( !user && "/login")}}>Resolve</Button>
                                    </ButtonGroup>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </div>
        </div>
    )
}

export default Home
