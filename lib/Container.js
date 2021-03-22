import React, { Component } from "react";
import { View } from "react-native";

class Container extends Component {
  state = {
    layout: null,
  };
  onLayoutCallback = () => {};
  onSetLayout = (e) => {
    this.setState({ layout: e.nativeEvent.layout });
  };
  onLayout = (layout, layoutParent) => {
    if (this.state.layout === null && layout) {
      layout.originX = layout.x;
      layout.originY = layout.y;
      this.setState({
        layout: layout,
      });
    } else {
      if (layout && layoutParent) {
        if (!this.state.layout) {
          layout.originX = layout.x;
          layout.originY = layout.y;
        } else {
          layout.originX = this.state.layout.x;
          layout.originY = this.state.layout.y;
        }
        layout.x = layout.originX + layoutParent.x;
        layout.y = layout.originY + layoutParent.y;
        this.setState({ layout }, this.onLayoutCallback);
      }
    }
  };
  UNSAFE_componentWillReceiveProps({ layout: nl }) {
    const { layout: l } = this.props;
    if (nl && l) {
      if (
        nl.x !== l.x ||
        nl.y !== l.y ||
        nl.width !== l.width ||
        nl.height !== l.height
      ) {
        this.onLayout(this.state.layout, nl);
      }
    } else if (nl) {
      this.onLayout(this.state.layout, nl);
    }
  }
  render() {
    const { children } = this.props;

    return (
      <View
        onLayout={(e) => this.onLayout(e.nativeEvent.layout, this.props.layout)}
      >
        {React.cloneElement(children, {
          layout: this.state.layout,
        })}
      </View>
    );
  }
}

export default Container;
