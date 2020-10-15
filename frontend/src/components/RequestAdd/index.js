import React, {useState} from 'react';
import "./styles.css";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, IconButton, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useHistory } from 'react-router-dom';
import axios from '../../hoc/axios';
import {useUserStatus} from '../../hoc/UserContext';

function RequestAdd() {

    const [person, setPerson] = useState();
    const [item, setItem] = useState();
    const [itemNum, setItemNum] = useState();
    const [{user},dispatch] = useUserStatus();
    const [request, setRequest] = useState();

    const history = useHistory();

    const addRequest = async () => {
        if(user){
            if( !item || !itemNum || !request){
                alert("All fields must be filled in!")
            }else{
                await axios.post(
                    "/api/request/create", 
                        {
                            "requestContent": request,
                            "requestFavors": [
                                {
                                    "from": user.userID,
                                    "rewards": 
                                        [
                                            {
                                                "name": item,
                                                "quantity": itemNum
                                            }
                                        ]
                                }
                            ],
                            "resolverID": "5f76c9967785b0887cefb148",
                            "resolverProof": "Proven"
                        }
                        ,{
                            headers: {
                                'Authorization': user.token
                            }
                        }       
                ).then((response)=>{
                    console.log(response);
                    window.location("/");
                }).catch((error)=>{
                    console.log(error);
                })
            }
        }
        else {
            alert("You must log in to add a request!")
        }
    }
    

    return (
        <div className="req-dialog">
            <div className="req-dialog-content">
                <h1>Add a new request</h1>
                <div className="req-dialog-request">
                    <div className="req-dialog-request text">
                        <p>Request:</p>
                        <span>(Required)</span>
                    </div>
                    <div className="req-dialog-request-input">
                        <textarea onChange={(e)=>setRequest(e.target.value)} value={request} rows="4" cols="50"></textarea>
                    </div>
                </div>
                <div className="req-dialog-reward">
                    <div className="req-dialog-reward text">
                        <p>Rewards:</p>
                        <span>(Required)</span>
                    </div>
                    <div className="widgets">
                    <div className="req-choosefrom">
                        <p>From: </p>
                        <Select 
                            id="choosePerson"
                            value={person}
                            onChange={(e)=>setPerson(e.target.value)}
                            style = {{width: '20ch'}}
                        >
                            <MenuItem value="Chris">Chris</MenuItem>
                            <MenuItem value="Hailey">Hailey</MenuItem>
                            <MenuItem value="Duc">Duc</MenuItem>
                            <MenuItem value="Thinh">Thinh</MenuItem>
                        </Select>
                    </div>
                    <div className="req-chooseitem">
                        <p>Items: </p>
                        <Select
                            id="chooseItem"
                            value={item}
                            onChange={(e)=>setItem(e.target.value)}
                        >
                            <MenuItem value="Chocolate">Chocolate</MenuItem>
                            <MenuItem value="Coffee">Coffee</MenuItem>
                            <MenuItem value="Candy">Candy</MenuItem>
                            <MenuItem value="Tea">Tea</MenuItem>
                        </Select>
                        <Input
                            className="req-chooseItemNum"
                            onChange={(e)=>setItemNum(e.target.value)}
                            inputProps={{
                                type: 'number',
                                min: 0,
                                max: 100,
                            }}
                        />
                        <IconButton onClick={() => alert("Remove")}>
                            <RemoveIcon />
                        </IconButton>
                    </div>
                    <IconButton onClick={() => alert("add")}>
                        <AddIcon />
                    </IconButton> 
                </div>
                </div>
                <div className="req-button">
                        <Button onClick={addRequest}>Create Request</Button>
                </div>
                </div>
        </div>
    )
}

export default RequestAdd