import React from 'react';

const Slack = React.createClass({

    getInitialState() {
        return {
            creds: {},
            errors: {}
        }
    },

    componentDidMount() {
        const storage = JSON.parse(localStorage.getItem('SLACK_CREDITS'));
        if(storage) {
            const creds = {
                slackName: storage.slackName,
                slackToken: storage.slackToken
            };

            this.setState({
                creds: creds
            })
        }
    },

    render() {
        return (
            <div className="dashboard grid">
                <div className="grid__item">
                    <div className="centerContent">
                        <h1 className="primary title">Slack Credits</h1>
                        <form className="credits" onSubmit={this.saveCredits}>

                            <input type='text' value={this.state.creds.slackName} placeholder="Slack Username"
                                   onChange={this.handleChange.bind(this, 'slackName')}
                                   className={`ko-input credits__input ${this.state.errors.slackName}`}/>

                            <input type='text' value={this.state.creds.slackToken} placeholder="Slack Token"
                                   onChange={this.handleChange.bind(this, 'slackToken')}
                                   className={`ko-input credits__input ${this.state.errors.slackToken}`}/>


                            <button className="ko-button--primary" onClick={this.saveCredits}>Save</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    },

    saveCredits(e) {
        e.preventDefault();

        if (this.state.creds.slackName && this.state.creds.slackToken) {
            localStorage.setItem('SLACK_CREDITS', JSON.stringify(this.state.creds));
            this.props.onSave(this.state.creds);
        } else {
            const errors = {};
            if(!this.state.creds.slackName) { errors.slackName = 'ko-input--danger'; }
            if(!this.state.creds.slackToken) { errors.slackToken = 'ko-input--danger'; }

            this.setState({
               errors: errors
            });
        }

    },

    handleChange: function(field, e) {
        const nextState = this.state.creds;
        nextState[field] = e.target.value;
        this.setState({creds: nextState});
    }

});

module.exports = Slack;
