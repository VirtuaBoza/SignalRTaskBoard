import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';
import Column from './Column';
import { COLUMNS } from '../constants';

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
      workItems: [],
    };

    this.taskBoardId = this.props.match.params.id;

    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleWorkItemChange = this.handleWorkItemChange.bind(this);
    this.handleAddClicked = this.handleAddClicked.bind(this);
    this.handleWorkItemDelete = this.handleWorkItemDelete.bind(this);
  }

  componentDidMount() {
    fetch(`/api/taskboards/${this.taskBoardId}/workitems`)
      .then(response => {
        if (response.ok) return response.json();
        throw response;
      })
      .then(workItems => {
        this.setState({ workItems });
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

    const workItems = this.reorderWorkItems(draggableId, destination, source);
    this.setState({ workItems });

    fetch(`api/taskboards/${this.taskBoardId}/workitems`, {
      method: 'PUT',
      body: JSON.stringify(workItems),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          this.setState({ workItems });
        } else {
          throw response.statusText;
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  reorderWorkItems(draggableId, destination, source) {
    const sourceColumnId = COLUMNS.find(
      column => column.id.toString() === source.droppableId,
    ).id;
    const destinationColumnId = COLUMNS.find(
      column => column.id.toString() === destination.droppableId,
    ).id;
    return this.state.workItems.map(workItem => {
      if (workItem.id.toString() === draggableId) {
        return {
          ...workItem,
          columnId: destinationColumnId,
          indexInColumn: destination.index,
        };
      } else if (sourceColumnId === destinationColumnId) {
        if (
          workItem.indexInColumn > source.index &&
          workItem.indexInColumn <= destination.index
        ) {
          return { ...workItem, indexInColumn: workItem.indexInColumn - 1 };
        } else if (
          workItem.indexInColumn < source.index &&
          workItem.indexInColumn >= destination.index
        ) {
          return { ...workItem, indexInColumn: workItem.indexInColumn + 1 };
        }
      } else {
        if (
          workItem.columnId === sourceColumnId &&
          workItem.indexInColumn > source.index
        ) {
          return { ...workItem, indexInColumn: workItem.indexInColumn - 1 };
        } else if (
          workItem.columnId === destinationColumnId &&
          workItem.indexInColumn >= destination.index
        ) {
          return { ...workItem, indexInColumn: workItem.indexInColumn + 1 };
        }
      }
      return workItem;
    });
  }

  handleWorkItemChange(event) {
    const workItems = this.state.workItems.map(workItem => {
      if (workItem.id.toString() === event.target.id) {
        return { ...workItem, content: event.target.value };
      }
      return workItem;
    });
    this.setState({ workItems });
  }

  handleAddClicked() {
    const workItem = {
      taskBoardId: this.taskBoardId,
      id: uuidv4(),
      content: '',
      columnId: 0,
      indexInColumn: this.state.workItems.filter(t => t.columnId === 0).length,
    };
    this.setState({ workItems: [...this.state.workItems, workItem] });
  }

  handleWorkItemDelete(workItem) {
    const workItems = [...this.state.workItems];
    const itemToDelete = workItems.find(item => item.id === workItem.id);
    workItems.splice(this.state.workItems.indexOf(itemToDelete), 1);
    this.setState({ workItems });
  }

  render() {
    const { classes } = this.props;
    const { workItems } = this.state;

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <div className={classes.container}>
          <Typography variant="h4">Taskboard ID: {this.taskBoardId}</Typography>
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
              workItems={workItems.filter(
                workItem => workItem.columnId === column.id,
              )}
              onWorkItemChange={this.handleWorkItemChange}
              onWorkItemDelete={this.handleWorkItemDelete}
            />
          ))}
        </div>
      </DragDropContext>
    );
  }
}

export default withRouter(withStyles(styles)(TaskBoardPage));
