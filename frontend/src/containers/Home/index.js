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
    
    useEffect(() => {
        async function fetchData(){
            await axios.get("/api/request/").then((response)=>{
                console.log(response);
                setRequests(response.data);           
            }).catch((error)=>{
                console.log(error);
            })
        }
        fetchData();
    }, []);

    console.log(requests); 

    //test adding hard coded request
    const addRequest = async () => {
        if(user){
            await axios.post(
                "/api/request/create", 
                    {
                        "requestContent": "This is another new request",
                        "requestFavors": [
                            {
                                "from":"5f856131b91e2723bc883b6c",
                                "rewards": [
                                    {
                                        "name": "candy",
                                        "quantity": 3
                                    },
                                    {
                                        "name": "pencil",
                                        "quantity": 2
                                    }
                                ]  
                            },
                               {
                                "from":"5f857d034454f882e027a37d",
                                "rewards": [
                                    {
                                        "name": "candy",
                                        "quantity": 3
                                    },
                                    {
                                        "name": "pencil",
                                        "quantity": 2
                                    }
                                ]  
                            }
                        ],
                        "resolverID": "5f85564a51bbe043503d4706",
                        "resolverProof": "Proven"
                    }
                    ,{
                        headers: {
                            'Authorization': user.token
                        }
                    }       
            ).then((response)=>{
                console.log(response);
            }).catch((error)=>{
                console.log(error);
            })
        }
        else {
            alert("You must log in to add a request!")
        }
    }

    return (
        <div className="home">
            <div className="home__data">
                <Container fixed style={{backgroundColor: '#ffffff', padding: 50}}>
                    <div className="request__add">
                        <h1>Public requests</h1>
                        <IconButton onClick={addRequest}>
                            <AddIcon />
                        </IconButton>   
                        <span>(Test Create Request)</span> 
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
                                                <p>{favor.from.userName}</p>
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
                                                        <p>{reward.name}: {reward.quantity} from {favor.from.userName}</p>
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
