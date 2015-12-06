import ReactDOM from 'react-dom';
import React from 'react';
import _ from 'lodash';
import {ReactRouter, Router, Route, IndexRoute} from 'react-router';

import Login from './components/login.jsx';
import Aws from './components/aws.jsx';
import Slack from './components/slack.jsx';
import Success from './components/success.jsx';

import './app.scss';

var App = React.createClass({

    getInitialState() {
        return {
            currentPage: 'Login',
            pages: ['Login', 'Aws', 'Slack', 'Success'],
            idToken: null,
            credits: {}
        }
    },

    render: function() {

        let pageToShow;

        switch (this.state.currentPage) {
        case 'Login':
            pageToShow = <Login lock={this.lock}/>;
            break;
        case 'Aws':
            pageToShow = <Aws onSave={this._onSaveAWS}/>;
            break;
        case 'Slack':
            pageToShow = <Slack onSave={this._onSaveSlack}/>;
            break;
        case 'Success':
            pageToShow = <Success credits={this.state.credits}/>;
            break;
        default :
            break;
        }

        return (
            <div>
                {pageToShow}
            </div>
        );
    },

    _onSaveAWS: function(creds) {
        let credits = this.state.credits;
        let newCredits = _.each(creds, (cred, key) => {
            return credits[key] = cred;
        });

        newCredits = {...credits};
        this.setState({
            credits: newCredits,
            currentPage: 'Slack'
        });
    },

    _onSaveSlack: function(creds) {
        let credits = this.state.credits;
        let newCredits = _.each(creds, (cred, key) => {
            return credits[key] = cred;
        });


        newCredits = {...credits};
        this.setState({
            credits: newCredits,
            currentPage: 'Success'
        });
    },

    componentWillMount: function() {
        this.lock = new Auth0Lock('yGobESzQr9KxIiM0NUzs9BLTA8yNCspI', 'butsco.eu.auth0.com');
        this.setState({idToken: this.getIdToken()})
    },

    componentDidMount: function() {
        if (this.state.idToken) {

            this.lock.getProfile(this.state.idToken, function(err, profile) {
                if (err) {
                    console.log("Error loading the Profile", err);
                    return;
                }

                let credits = this.state.credits;
                credits.username = profile.name;

                this.setState({
                    profile: profile,
                    credits: credits,
                    currentPage: 'Aws'
                });

                history.pushState("", document.title, window.location.pathname);
            }.bind(this));

        }

    },

    getIdToken: function() {
        var idToken = localStorage.getItem('userToken');
        var authHash = this.lock.parseHash(window.location.hash);

        if (!idToken && authHash) {
            if (authHash.id_token) {
                idToken = authHash.id_token
                localStorage.setItem('userToken', authHash.id_token);
            }
            if (authHash.error) {
                console.log("Error signing in", authHash);
                return null;
            }
        }
        return idToken;
    }
});


ReactDOM.render(<App />, document.getElementById('app'));
