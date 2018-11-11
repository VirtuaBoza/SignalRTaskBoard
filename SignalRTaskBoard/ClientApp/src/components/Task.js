import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  border: 2px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? '#BAA7B0' : '#B2ABBF')};
  display: flex;
`;

const Input = styled.input`
  width: 100%;
`;

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inEditMode: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleClick() {
    this.setState({ inEditMode: true });
  }

  handleBlur(event) {
    this.setState({ inEditMode: false });

    const task = { ...this.props.task, content: event.target.value };

    fetch(`api/workitems/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
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

  render() {
    const { task, onChange } = this.props;
    const { inEditMode } = this.state;
    return (
      <Draggable draggableId={task.id.toString()} index={task.indexInColumn}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <div onClick={this.handleClick}>
              {inEditMode ? (
                <Input
                  id={task.id}
                  value={task.content}
                  onChange={onChange}
                  onBlur={this.handleBlur}
                  autoFocus
                />
              ) : (
                task.content
              )}
            </div>
          </Container>
        )}
      </Draggable>
    );
  }
}

export default Task;
