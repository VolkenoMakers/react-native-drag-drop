import React, { Component } from "react";
import { View } from "react-native";

class Container extends Component {
  state = {
    layout: null,
  };
  ref = React.createRef();
  onLayoutCallback = () => {};
  onSetLayout = () => {
    if (this.ref.current) {
      this.ref.current.measure((fx, fy, width, height, px, py) => {
        const layout = {
          x: px,
          y: py,
          width,
          height,
        };
        this.setState({ layout }, this.onLayoutCallback);
      });
    }
  };
  render() {
    const { children } = this.props;

    return (
      <View ref={this.ref} onLayout={(e) => this.onSetLayout()}>
        {React.cloneElement(children, {
          layout: this.state.layout,
        })}
      </View>
    );
  }
}

export default Container;
