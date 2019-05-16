import React, { Component } from 'react';
import './CSS/App.css';
import FormContainer from './containers/FormContainer'

const styles = {
  fontFamimly:"sans-serif",
  textAlign:"center",
}

class App extends Component {
  render() {
    return (
      <div className="col-sm-12">
        <h1 style={styles}>Aemulus</h1>
        <FormContainer />
      </div>
    );
  }
}

export default App;
