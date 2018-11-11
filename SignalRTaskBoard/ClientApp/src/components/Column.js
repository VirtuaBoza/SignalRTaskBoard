import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Task from './Task';

const Container = styled.div`
  margin: 8px;
  border: 2px solid lightgrey;
  border-radius: 2px;
  width: 300px;
  display: flex;
  flex-direction: column;
  background-color: #bfd5e2;
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div`
  padding: 8px;
  background-color: ${props => (props.isDraggingOver ? '#B1B5C8' : '#bfd5e2')};
  flex-grow: 1;
  min-height: 100px;
`;

const Column = ({ column, tasks, onTaskChange }) => {
  return (
    <Container>
      <Title>{column.title}</Title>
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
    </Container>
  );
};

export default Column;
