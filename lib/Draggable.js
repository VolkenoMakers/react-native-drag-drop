import React, { Component } from "react";
import { Animated, PanResponder, Pressable } from "react-native";
class Draggable extends Component {
  state = {
    pan: new Animated.ValueXY(),
    dragging: false,
    pressed: false,
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
        return { dragging: false, pressed: false };
      }
      return old;
    });
  };
  onEnd = (e, gesture) => {
    this.onDragEnd(e, gesture);
  };
  UNSAFE_componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => this.state.pressed,
      onPanResponderGrant: (e, gesture) => {
        this.props.onGrant(true);
        this.setState({ dragging: true });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: this.onResponderMove,
      onPanResponderTerminate: this.onEnd,
      onPanResponderEnd: this.onEnd,
      onPanResponderRelease: this.onDragEnd,
      onMoveShouldSetPanResponderCapture: () => this.state.pressed,
      onPanResponderReject: this.onEnd,
      onMoveShouldSetPanResponder: () => this.state.pressed,
      onPanResponderTerminationRequest: () => this.state.pressed,
      onShouldBlockNativeResponder: () => this.state.pressed,
      onStartShouldSetPanResponderCapture: () => this.state.pressed,
    });
  }
  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    let { draggedElementStyle, style } = this.props;
    if (this.state.pressed) {
      style = { ...style, ...draggedElementStyle };
    }
    if (this.state.dragging) {
      panStyle.zIndex = 1000;
      panStyle.elevation = 1000;
      style = { ...style, ...(draggedElementStyle || { opacity: 0.6 }) };
    }

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[panStyle, style]}
      >
        <Pressable
          delayLongPress={400}
          onLongPress={() => this.setState({ pressed: true })}
        >
          {this.props.children}
        </Pressable>
      </Animated.View>
    );
  }
}

export default Draggable;
