import React, { Component } from "react";
import { Animated, PanResponder } from "react-native";
class Draggable extends Component {
  state = {
    pan: new Animated.ValueXY(),
    panValue: { x: 0, y: 0 },
  };

  UNSAFE_componentWillMount() {
    this.state.pan.addListener((value) => this.setState({ panValue: value }));
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.props.onGrant(true);
        this.state.pan.setOffset({
          x: this.state.panValue.x,
          y: this.state.panValue.y,
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gesture) => {
        this.state.pan.setValue({ x: gesture.dx, y: gesture.dy });
        this.props.onDrag(gesture, this.props.layout, (y, x) => null);
      },
      onPanResponderTerminate: (e, gesture) => {
        this.props.onGrant(false);
        if (!this.props.onDragEnd(gesture)) {
          this.state.pan.setValue({ x: 0, y: 0 });
        }
      },
      onPanResponderRelease: (e, gesture) => {
        this.props.onGrant(false);
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
