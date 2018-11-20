import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Layout from './components/Layout';
import StartPage from './components/StartPage';
import TaskBoardPage from './components/TaskBoardPage';

export default class App extends Component {
  render() {
    return (
      <Layout>
        <Route exact path="/" component={StartPage} />
        <Route exact path="/:id" component={TaskBoardPage} />
      </Layout>
    );
  }
}
