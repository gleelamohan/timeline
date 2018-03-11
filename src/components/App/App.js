import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IconSettings from 'design-system-react/components/icon-settings';

import configureStore from '../../store/configureStore';
import Narrative from '../../containers/Narrative';

const store = configureStore();

import './style.css';

class App extends Component {
    render() {
        return (
            <Router>
                <Provider store={store}>
                    <IconSettings iconPath="css/sfdc/icons">
                        <div>
                            <Route exact path="/:account_id?" component={Narrative} />
                        </div>
                    </IconSettings>
                </Provider>
            </Router>
        );
    }
}

export default App;
