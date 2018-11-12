import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 8px;
`;

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inEditMode: false,
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

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleBlur(event);
    }
  }

  render() {
    const { task, onChange } = this.props;
    const { inEditMode } = this.state;
    return (
      <Draggable draggableId={task.id.toString()} index={task.indexInColumn}>
        {provided => (
          <Container ref={provided.innerRef}>
            <Card {...provided.draggableProps} {...provided.dragHandleProps}>
              <CardContent onClick={this.handleClick}>
                {inEditMode ? (
                  <TextField
                    id={task.id}
                    value={task.content}
                    onChange={onChange}
                    onBlur={this.handleBlur}
                    onKeyPress={this.handleKeyPress}
                    style={{ width: '100%' }}
                    placeholder="Task Title"
                    autoFocus
                  />
                ) : (
                  <Typography variant="title">{task.content}</Typography>
                )}
              </CardContent>
            </Card>
          </Container>
        )}
      </Draggable>
    );
  }
}

export default Task;
