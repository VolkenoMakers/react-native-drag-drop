import React, { Component } from "react";
import Container from "./Container";
import Draggable from "./Draggable";

class DragItem extends Container {
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
      addedHeight,
      itemsInZoneStyle,
    } = this.props;
    const child = renderItem(item);
    const newChild = React.cloneElement(child, {
      style: {},
      ref: this.ref,
      onLayout: (e) => this.onSetLayout(),
    });
    return (
      <Draggable
        layout={this.state.layout}
        onDrag={onDrag}
        onGrant={onGrant}
        addedHeight={addedHeight}
        style={{ ...child.props.style, ...itemsInZoneStyle }}
        onDragEnd={() => onDragEnd(item)}
      >
        {newChild}
      </Draggable>
    );
  }
}

export default DragItem;
