import React from 'react';
import Logo from './logo.jsx';


const Login = React.createClass({

    getInitialState() {
        return {
            logos: [
                {
                    url: 'http://www5.pcmag.com/media/images/396208-slack-logo.jpg?thumb=y',
                    name: 'Slack'
                },
                {
                    url: 'https://pbs.twimg.com/profile_images/378800000124779041/fbbb494a7eef5f9278c6967b6072ca3e_400x400.png',
                    name: 'Docker'
                }
            ]
        }
    },

    showLock: function() {
        // We receive lock from the parent component in this case
        // If you instantiate it in this component, just do this.lock.show()
        this.props.lock.show({
            icon: 'http://www.hercampus.com/sites/default/files/2015/08/14/31-emma-watson.w529.h529.2x.jpg'
        });
    },

    render: function() {

        const logos = this.state.logos.map(function(logo, key) {
            return <Logo key={key} url={logo.url} name={logo.name}/>
        });

        return (
            <div className="grid">
                <div className="grid__item">
                    <div className="centerContent">

                        <h1 className="primary title">
                            Emma
                        </h1>

                        <h3>
                            A slack-bot to deploy Docker images on any cloud
                        </h3>

                        <div className="grid">
                            {logos}
                        </div>

                        <button className="ko-button--primary" onClick={this.showLock}>Sign In</button>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Login;
