import React, { Component } from "react";
import { View } from "react-native";

class Container extends Component {
  state = {
    layout: null,
  };
  ref = React.createRef();
  onLayoutCallback = () => {};
  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  UNSAFE_componentWillReceiveProps({ changed }) {
    if (changed && !this.props.changed) {
      this.onSetLayout();
    }
  }
  onSetLayout = (e) => {
    if (this.ref.current) {
      if (this.ref.current.measure) {
        this.ref.current.measure((fx, fy, width, height, px, py) => {
          const layout = {
            x: px,
            y: py,
            width,
            height,
          };
          this.setState({ layout }, this.onLayoutCallback);
        });
      } else if (e) {
        this.setState({ layout: e.nativeEvent.layout }, this.onLayoutCallback);
      }
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
