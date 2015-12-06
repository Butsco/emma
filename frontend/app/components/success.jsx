import React from 'react';
import $ from 'jquery';

const Success = React.createClass({

    render() {
        return (
            <div className="grid">
                <div className="grid__item">
                    <div className="centerContent">

                        <h1 className="primary title">
                            Success
                        </h1>

                        <p>We are currently getting your docker url...</p>



                    </div>
                </div>
            </div>
        );
    },

    componentDidMount() {
        $.ajax({
            url: 'https://emmatc.localtunnel.me/users/',
            dataType: 'json',
            method: 'PUT',
            data: this.props.credits,
            success: function(data) {
                console.log('success data', data);
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
});

module.exports = Success;
