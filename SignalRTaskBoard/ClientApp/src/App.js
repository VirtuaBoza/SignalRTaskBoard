import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './components/Column';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export default class App extends Component {
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
  }

  componentDidMount() {
    fetch('/api/workitems')
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

  render() {
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <CssBaseline />
        <Container>
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
        </Container>
      </DragDropContext>
    );
  }
}
