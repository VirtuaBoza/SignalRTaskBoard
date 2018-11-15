import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    marginBottom: 8,
  },
});

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inEditMode: props.task.content ? false : true,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleClick() {
    this.setState({ inEditMode: true });
  }

  handleBlur(event) {
    this.setState({ inEditMode: false });

    const task = { ...this.props.task, content: event.target.value };

    if (task.content && !task.content.match(/^ *$/)) {
      fetch(`api/workitems/${task.id}`, {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.error(error);
      });
    } else {
      fetch(`api/workitems/${task.id}`, {
        method: 'DELETE',
      })
        .then(() => this.props.onDelete(task))
        .catch(error => {
          console.error(error);
        });
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleBlur(event);
    }
  }

  render() {
    const { task, onChange, classes } = this.props;
    const { inEditMode } = this.state;
    return (
      <Draggable draggableId={task.id.toString()} index={task.indexInColumn}>
        {provided => (
          <div className={classes.container} ref={provided.innerRef}>
            <Card {...provided.draggableProps} {...provided.dragHandleProps}>
              <CardContent onClick={this.handleClick}>
                {inEditMode ? (
                  <TextField
                    id={task.id.toString()}
                    value={task.content ? task.content : ''}
                    onChange={onChange}
                    onBlur={this.handleBlur}
                    onKeyPress={this.handleKeyPress}
                    style={{ width: '100%' }}
                    placeholder="Task Title"
                    autoFocus
                  />
                ) : (
                  <Typography variant="h6">{task.content}</Typography>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  }
}

export default withStyles(styles)(Task);
