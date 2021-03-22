import React, { Component } from "react";
import Draggable from "./Draggable";

class DragItem extends Component {
  state = {
    layout: null,
  };

  render() {
    const {
      onDrag,
      onDragEnd,
      item,
      renderItem,
      onGrant,
      itemsInZoneStyle,
    } = this.props;
    const child = renderItem(item);
    const newChild = React.cloneElement(child, {
      style: {},
      onLayout: (e) => this.setState({ layout: e.nativeEvent.layout }),
    });
    return (
      <Draggable
        layout={this.state.layout}
        onDrag={onDrag}
        onGrant={onGrant}
        style={{ ...child.props.style, ...itemsInZoneStyle }}
        onDragEnd={() => onDragEnd(item)}
      >
        {newChild}
      </Draggable>
    );
  }
}

export default DragItem;
