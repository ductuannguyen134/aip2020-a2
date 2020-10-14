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
import './style.css';
import AddIcon from '@material-ui/icons/Add';
import FavorAdd from '../../components/FavorAdd';
import axios from '../../hoc/axios';
import {useUserStatus} from '../../hoc/UserContext';

function Favors() {
    const [{user}, dispatch] = useUserStatus();
    const[favorList, setFavorList] = useState([]);
    const [open, setOpen] = useState(false);
    let history = useHistory();
       
    // Retrieve a list of Favor for the user
    useEffect(() => {
    async function fetchData(userID) {
      const response = await axios.get(`/api/favor/user/${userID}`);
      setFavorList(response.data);
      console.log(response.data);
    }
    fetchData("5f862b953d152a307c75cd05").catch((error)=>{
            console.log(error);
        });
    }, []);
    
    function handleComplete(id){
        if(window.confirm("Do you want to mark this favor as completed?")){
            favorList[id].status = true;
            alert("Status:" + favorList[id].isComplete);
        };
    }

    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
        history.push("/favors");
    };    

    return (
        <div>
            <Container fixed style={{backgroundColor: '#ffffff', padding: 50}}>
                <div className="favor__heading">
                    <h1>Your Favors</h1>
                    <Link to="/favors/add">
                        <IconButton onClick={handleClickOpen}>
                            <AddIcon />
                        </IconButton>    
                    </Link>
                </div>
                {/* Router to debts and active */}
                <TableContainer component={Paper}>
                        <Table className="table" aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Favors</TableCell>
                                <TableCell align="right">From</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Initial Proof</TableCell>
                                <TableCell align="right">Resolved Proof</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {favorList.map((favor) => (
                                <TableRow key={favor._id}>
                                <TableCell component="th" scope="row">
                                    {
                                        favor.items.map((item)=>(
                                            <>
                                                <p>{item.quantity} {item.name}</p>
                                            </>
                                        ))
                                    }
                                </TableCell>
                                <TableCell align="right">{favor.debtorID.userName}</TableCell>
                                <TableCell align="right">{favor.isComplete ? "Completed" : "Uncompleted"}</TableCell>
                                <TableCell align="right">{favor.createdImage}</TableCell>
                                <TableCell align="right">{favor.completedImage}</TableCell>
                                <TableCell align="right">
                                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                                        <Button onClick={()=>handleComplete(favor._id)}>Mark as completed</Button>
                                    </ButtonGroup>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {/* Route to favor add */}
                    <Route path="/favors/add">
                        <Dialog maxWidth="lg" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <FavorAdd favorList={favorList}/>
                        </Dialog>
                    </Route>
            </Container>
        </div>
    )
}

export default Favors
