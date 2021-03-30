import React, { Component } from "react";
import { Animated, PanResponder } from "react-native";
class Draggable extends Component {
  state = {
    pan: new Animated.ValueXY(),
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
      // this.onResponderMove(e, gesture);
    });
  };
  onDragEnd = (e, gesture) => {
    this.setState((old) => {
      if (old.dragging) {
        this.props.onGrant(false);

        if (!this.props.onDragEnd(gesture)) {
          this.state.pan.setValue({ x: 0, y: 0 });
        }
        return { dragging: false };
      }
      return old;
    });
  };
  onEnd = (e, gesture) => {
    this.onDragEnd(e, gesture);
  };
  UNSAFE_componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.props.onGrant(true);
        this.setState({ dragging: true });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: this.onResponderMove,
      onPanResponderTerminate: this.onEnd,
      onPanResponderEnd: this.onEnd,
      onPanResponderRelease: this.onDragEnd,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderReject: this.onEnd,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
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
