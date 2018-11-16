import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Droppable } from 'react-beautiful-dnd';
import WorkItem from './WorkItem';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit,
    width: 300,
    minWidth: 300,
  },
  titleContainer: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
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

const Column = ({
  column,
  workItems,
  onWorkItemChange,
  onWorkItemDelete,
  classes,
}) => {
  return (
    <div className={classes.container}>
      <Paper>
        <div className={classes.titleContainer}>
          <Typography variant="h5">{column.title}</Typography>
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
              {[...workItems]
                .sort((a, b) => a.indexInColumn - b.indexInColumn)
                .map(workItem => (
                  <WorkItem
                    key={workItem.id}
                    workItem={workItem}
                    onChange={onWorkItemChange}
                    onDelete={onWorkItemDelete}
                  />
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
