import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Task from './Task';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const Container = styled.div`
  margin: 8px;
  width: 300px;
`;

const TaskList = styled.div`
  padding: 8px;
  min-height: 100px;
`;

const TitleContainer = styled.div`
  padding: 8px;
`;

const Column = ({ column, tasks, onTaskChange }) => {
  return (
    <Container>
      <Paper>
        <TitleContainer>
          <Typography variant="title">{column.title}</Typography>
        </TitleContainer>
        <Droppable droppableId={column.id.toString()}>
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {[...tasks]
                .sort((a, b) => a.indexInColumn - b.indexInColumn)
                .map(task => (
                  <Task key={task.id} task={task} onChange={onTaskChange} />
                ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Paper>
    </Container>
  );
};

export default Column;
