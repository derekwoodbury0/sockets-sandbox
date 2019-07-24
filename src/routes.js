import React from 'react'
import { Switch, Route} from 'react-router-dom'

import Dashboard from './components/dashboard'
import Player from './components/player'

export default (
    <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route path='/player' component={Player} />
        <Route component={Dashboard} />
    </Switch>
)