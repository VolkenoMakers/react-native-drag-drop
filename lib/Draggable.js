import React, { Component } from "react";
import { Animated, PanResponder } from "react-native";
class Draggable extends Component {
  state = {
    pan: new Animated.ValueXY(),
    panValue: { x: 0, y: 0 },
    dragging: false,
  };
  onResponderMove = (e, gesture) => {
    this.state.pan.setValue({
      x: gesture.dx,
      y: gesture.dy + this.props.addedHeight,
    });
    this.props.onDrag(gesture, this.props.layout, (value) => {
      this.state.pan.setValue({
        x: gesture.dx,
        y: gesture.dy + this.props.addedHeight,
      });
      this.onResponderMove(e, gesture);
    });
  };
  UNSAFE_componentWillMount() {
    this.state.pan.addListener((value) => this.setState({ panValue: value }));
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.props.onGrant(true);
        this.setState({ dragging: true });
        this.state.pan.setOffset({
          x: this.state.panValue.x,
          y: this.state.panValue.y,
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: this.onResponderMove,
      onPanResponderTerminate: (e, gesture) => {
        this.props.onGrant(false);
        this.setState({ dragging: false });
        if (!this.props.onDragEnd(gesture)) {
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },
      onPanResponderRelease: (e, gesture) => {
        this.props.onGrant(false);
        this.setState({ dragging: false });
        if (!this.props.onDragEnd(gesture)) {
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },
    });
  }
  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    if (this.state.dragging) {
      panStyle.zIndex = 1000;
      panStyle.elevation = 1000;
    }
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[panStyle, this.props.style]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default Draggable;
