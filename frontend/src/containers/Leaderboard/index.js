import React from 'react';
import {Container, TextField, Button, ButtonGroup} from '@material-ui/core';
import { Link, Route, useHistory } from 'react-router-dom';
import {useUserStatus} from '../../hoc/UserContext';

function Leaderboard() {

    const user = useUserStatus();
    const history = useHistory();

    return (
        <div>
             <Container fixed style={{backgroundColor: '#ffffff', padding: 50}}>
                <h1>Leaderboard</h1>
                {/* Router to debts and active */}
                <ButtonGroup  aria-label="contained primary button group">
                        <Button variant="contained" color="primary" onClick={()=>{history.push("/leaderboard/debts")}}>Debts</Button>
                        <Button variant="contained" color="secondary" onClick={()=>{history.push("/leaderboard/active")}}>Active</Button>
                </ButtonGroup>
                <Route path="/leaderboard/active">
                    <h1>Active</h1>
                </Route>
                <Route path="/leaderboard/debts">
                    <h1>Debts</h1>
                </Route>
            </Container>
        </div>
    )
}

export default Leaderboard
