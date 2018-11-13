import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
    cursor: 'pointer',
  },
});

const Layout = ({ classes, children, history }) => {
  return (
    <div>
      <CssBaseline />
      <AppBar position="static" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
            onClick={() => history.push('/')}
          >
            SignalR Taskboard
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default withRouter(withStyles(styles)(Layout));
