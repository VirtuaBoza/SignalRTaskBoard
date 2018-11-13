import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit,
    width: 300,
  },
  titleContainer: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    margin: theme.spacing.unit,
  },
  taskList: {
    padding: theme.spacing.unit,
    minHeight: '100px',
  },
  taskListDragging: {
    padding: theme.spacing.unit,
    minHeight: '100px',
    backgroundColor: 'lightgray',
  },
});

const Column = ({ column, tasks, onTaskChange, classes }) => {
  return (
    <div className={classes.container}>
      <Paper>
        <div className={classes.titleContainer}>
          <Typography variant="title">{column.title}</Typography>
        </div>
        <Droppable droppableId={column.id.toString()}>
          {(provided, snapshot) => (
            <div
              className={
                snapshot.isDraggingOver
                  ? classes.taskListDragging
                  : classes.taskList
              }
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {[...tasks]
                .sort((a, b) => a.indexInColumn - b.indexInColumn)
                .map(task => (
                  <Task key={task.id} task={task} onChange={onTaskChange} />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Paper>
    </div>
  );
};

export default withStyles(styles)(Column);
