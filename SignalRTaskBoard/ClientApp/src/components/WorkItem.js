import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Draggable } from 'react-beautiful-dnd';

const styles = theme => ({
  container: {
    marginBottom: 8,
  },
});

class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inEditMode: props.workItem.content ? false : true,
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

    const workItem = { ...this.props.workItem, content: event.target.value };

    if (workItem.content && !workItem.content.match(/^ *$/)) {
      fetch(`api/workitems/${workItem.id}`, {
        method: 'POST',
        body: JSON.stringify(workItem),
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.error(error);
      });
    } else {
      fetch(`api/workitems/${workItem.id}`, {
        method: 'DELETE',
      })
        .then(() => this.props.onDelete(workItem))
        .catch(error => {
          console.error(error);
        });
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleBlur(event);
    }
  }

  render() {
    const { workItem, onChange, classes } = this.props;
    const { inEditMode } = this.state;

    return (
      <Draggable
        draggableId={workItem.id.toString()}
        index={workItem.indexInColumn}
      >
        {provided => (
          <div className={classes.container} ref={provided.innerRef}>
            <Card {...provided.draggableProps} {...provided.dragHandleProps}>
              <CardContent onClick={this.handleClick}>
                {inEditMode ? (
                  <TextField
                    id={workItem.id.toString()}
                    value={workItem.content ? workItem.content : ''}
                    onChange={onChange}
                    onBlur={this.handleBlur}
                    onKeyPress={this.handleKeyPress}
                    style={{ width: '100%' }}
                    placeholder="Task Title"
                    autoFocus
                  />
                ) : (
                  <Typography variant="h6">{workItem.content}</Typography>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  }
}

WorkItem.propTypes = {
  workItem: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(WorkItem);
