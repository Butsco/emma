import React from 'react';

const Logo = React.createClass({
   render() {
       return (
           <div className="logo__item">
               <img src={this.props.url} alt={`Logo ${this.props.name}`} width="100px"/>
           </div>
       )
   }
});

module.exports = Logo;
