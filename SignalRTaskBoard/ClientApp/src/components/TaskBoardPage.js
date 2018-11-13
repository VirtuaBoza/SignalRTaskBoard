import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import Button from '@material-ui/core/Button';

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
      tasks: [],
      columns: [
        {
          id: 0,
          title: 'To do',
        },
        {
          id: 1,
          title: 'In Progress',
        },
        {
          id: 2,
          title: 'Done',
        },
      ],
    };

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleAddClicked = this.handleAddClicked.bind(this);
  }

  componentDidMount() {
    fetch(`/api/workitems/${this.props.match.params.id}`)
      .then(response => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then(tasks => {
        this.setState({ tasks });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumnId = this.state.columns.find(
      column => column.id.toString() === source.droppableId,
    ).id;
    const destinationColumnId = this.state.columns.find(
      column => column.id.toString() === destination.droppableId,
    ).id;

    const tasks = this.state.tasks.map(task => {
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

    this.setState({ tasks });

    fetch('api/workitems', {
      method: 'PUT',
      body: JSON.stringify(tasks),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then(jsonResponse => {
        console.log('success', jsonResponse);
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleTaskChange(event) {
    const tasks = this.state.tasks.map(task => {
      if (task.id.toString() === event.target.id) {
        task.content = event.target.value;
      }
      return task;
    });
    this.setState({ tasks });
  }

  handleAddClicked() {
    console.log(this.state.tasks.filter(task => task.columnId === 0).length);

    const newItem = {
      indexInColumn: this.state.tasks.filter(task => task.columnId === 0)
        .length,
      taskBoardId: this.props.match.params.id,
    };

    fetch(`/api/workitems`, {
      method: 'POST',
      body: JSON.stringify(newItem),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then(task => {
        this.setState({ tasks: [...this.state.tasks, task] });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <div className={classes.container}>
          <Button
            color="primary"
            className={classes.addButton}
            onClick={this.handleAddClicked}
          >
            Add
          </Button>
          {this.state.columns.map(column => {
            const tasks = this.state.tasks.filter(
              task => task.columnId === column.id,
            );
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onTaskChange={this.handleTaskChange}
              />
            );
          })}
        </div>
      </DragDropContext>
    );
  }
}

export default withRouter(withStyles(styles)(TaskBoardPage));
