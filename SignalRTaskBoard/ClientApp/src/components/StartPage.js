import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class StartPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      error: false,
    };

    this.handleSubmitTaskboardId = this.handleSubmitTaskboardId.bind(this);
    this.handleCreateNewTaskboard = this.handleCreateNewTaskboard.bind(this);
  }

  handleSubmitTaskboardId(event) {
    event.preventDefault();
    fetch(`/api/taskboards/${this.state.input}`)
      .then(response => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then(taskboard => {
        this.props.history.push(`/${taskboard.id}`, { taskboard });
      })
      .catch(() => this.setState({ error: true }));
  }

  handleCreateNewTaskboard(event) {
    event.preventDefault();
    fetch('/api/taskboards', {
      method: 'POST',
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then(taskboard => {
        this.props.history.push(`/${taskboard.id}`, { taskboard });
      })
      .catch(error => console.error(error));
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Enter Taskboard ID
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="email">Taskboard ID</InputLabel>
              <Input
                onChange={event => this.setState({ input: event.target.value })}
                autoFocus
                error={this.state.error}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleSubmitTaskboardId}
            >
              Enter
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleCreateNewTaskboard}
            >
              Create New Taskboard
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

StartPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(StartPage));
