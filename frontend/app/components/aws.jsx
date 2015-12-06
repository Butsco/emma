import React from 'react';

const Aws = React.createClass({

    getInitialState() {
        return {
            creds: {},
            errors: {}
        }
    },

    componentDidMount() {
        const storage = JSON.parse(localStorage.getItem('AWS_CREDITS'));
        if(storage) {
            const creds = {
                awsAccessKeyId: storage.awsAccessKeyId,
                awsSecretAccessKey: storage.awsSecretAccessKey
            };

            this.setState({
                creds: creds
            })
        }
    },

    render() {
        return (
            <div className="grid">
                <div className="grid__item">
                    <div className="centerContent">
                        <h1 className="primary title">AWS Credits</h1>
                        <form className="credits" onSubmit={this.saveCredits}>

                            <input type='text' value={this.state.creds.awsAccessKeyId} placeholder="Access Key"
                                   onChange={this.handleChange.bind(this, 'awsAccessKeyId')}
                                   className={`ko-input credits__input ${this.state.errors.awsAccessKeyId}`}/>

                            <input type='text' value={this.state.creds.awsSecretAccessKey} placeholder="Secret Key"
                                   onChange={this.handleChange.bind(this, 'awsSecretAccessKey')}
                                   className={`ko-input credits__input ${this.state.errors.awsSecretAccessKey}`}/>

                            <button className="ko-button--primary" onClick={this.saveCredits}>Save</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    },

    saveCredits(e) {
        e.preventDefault();

        if (this.state.creds.awsAccessKeyId && this.state.creds.awsSecretAccessKey) {
            localStorage.setItem('AWS_CREDITS', JSON.stringify(this.state.creds));
            this.props.onSave(this.state.creds);
        }  else {
            const errors = {};
            if(!this.state.creds.awsAccessKeyId) { errors.awsAccessKeyId = 'ko-input--danger'; }
            if(!this.state.creds.awsSecretAccessKey) { errors.awsSecretAccessKey = 'ko-input--danger'; }

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

module.exports = Aws;
