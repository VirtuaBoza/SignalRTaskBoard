import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';

export default class App extends Component {
  displayName = App.name;

  render() {
    return <Route exact path="/" component={Home} />;
  }
}
