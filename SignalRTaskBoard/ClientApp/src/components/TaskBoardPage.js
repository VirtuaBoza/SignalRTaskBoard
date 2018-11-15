import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { COLUMNS } from '../constants';
import uuidv4 from 'uuid/v4';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: theme.spacing.unit * 4,
  },
  addButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
});

class TaskBoardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskboardId: '',
      tasks: [],
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleAddClicked = this.handleAddClicked.bind(this);
    this.handleTaskDelete = this.handleTaskDelete.bind(this);
  }

  componentDidMount() {
    fetch(`/api/taskboards/${this.props.match.params.id}`)
      .then(response => {
        if (response.ok) return response.json();
        throw response;
      })
      .then(taskboard => {
        this.setState({
          taskboardId: taskboard.id,
          tasks: taskboard.workItems,
        });
      })
      .catch(() => this.props.history.push('/'));
  }

  handleDragEnd(result) {
    const { draggableId, destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const tasks = this.reorderTasks(draggableId, destination, source);

    fetch('api/workitems', {
      method: 'PUT',
      body: JSON.stringify(tasks),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          this.setState({ tasks });
        } else {
          throw response.statusText;
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  reorderTasks(draggableId, destination, source) {
    const sourceColumnId = COLUMNS.find(
      column => column.id.toString() === source.droppableId,
    ).id;
    const destinationColumnId = COLUMNS.find(
      column => column.id.toString() === destination.droppableId,
    ).id;
    return this.state.tasks.map(task => {
      if (task.id.toString() === draggableId) {
        return {
          ...task,
          columnId: destinationColumnId,
          indexInColumn: destination.index,
        };
      } else if (sourceColumnId === destinationColumnId) {
        if (
          task.indexInColumn > source.index &&
          task.indexInColumn <= destination.index
        ) {
          return { ...task, indexInColumn: task.indexInColumn - 1 };
        } else if (
          task.indexInColumn < source.index &&
          task.indexInColumn >= destination.index
        ) {
          return { ...task, indexInColumn: task.indexInColumn + 1 };
        }
      } else {
        if (
          task.columnId === sourceColumnId &&
          task.indexInColumn > source.index
        ) {
          return { ...task, indexInColumn: task.indexInColumn - 1 };
        } else if (
          task.columnId === destinationColumnId &&
          task.indexInColumn >= destination.index
        ) {
          return { ...task, indexInColumn: task.indexInColumn + 1 };
        }
      }
      return task;
    });
  }

  handleTaskChange(event) {
    const tasks = this.state.tasks.map(task => {
      if (task.id.toString() === event.target.id) {
        return { ...task, content: event.target.value };
      }
      return task;
    });
    this.setState({ tasks });
  }

  handleAddClicked() {
    const task = {
      taskBoardId: this.state.taskboardId,
      id: uuidv4(),
      content: '',
      columnId: 0,
      indexInColumn: this.state.tasks.filter(t => t.columnId === 0).length,
    };
    this.setState({ tasks: [...this.state.tasks, task] });
  }

  handleTaskDelete(task) {
    const tasks = [...this.state.tasks];
    tasks.splice(this.state.tasks.indexOf(task), 1);
    this.setState({ tasks });
  }

  render() {
    const { classes } = this.props;
    const { tasks, taskboardId } = this.state;

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <div className={classes.container}>
          <Typography variant="h4">Taskboard ID: {taskboardId}</Typography>
        </div>
        <div className={classes.container}>
          <Button
            color="primary"
            className={classes.addButton}
            onClick={this.handleAddClicked}
          >
            Add
          </Button>
          {COLUMNS.map(column => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter(task => task.columnId === column.id)}
              onTaskChange={this.handleTaskChange}
              onTaskDelete={this.handleTaskDelete}
            />
          ))}
        </div>
      </DragDropContext>
    );
  }
}

export default withRouter(withStyles(styles)(TaskBoardPage));
