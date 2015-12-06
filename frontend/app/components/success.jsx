import React from 'react';
import $ from 'jquery';

const Success = React.createClass({

    getInitialState() {
        return {
            data: {
                docker: 'We are currently getting your docker url...'
            }
        }
    },

    render() {
        return (
            <div className="grid">
                <div className="grid__item">
                    <div className="centerContent">

                        <h1 className="primary title">
                            Docker Link Generator
                        </h1>

                        <p> {this.state.data.docker} </p>
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount() {
        $.ajax({
            url: 'https://emmatc.herokuapp.com/users/',
            dataType: 'json',
            method: 'PUT',
            contentType: "application/json",
            data: JSON.stringify(this.props.credits),
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
});

module.exports = Success;
