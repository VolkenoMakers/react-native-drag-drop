import React, { Component, ReactElement } from "react";
import { LayoutChangeEvent, View } from "react-native";

export type LayoutProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export interface ContainerState {
  layout: LayoutProps | null;
}
export interface ContainerProps {
  changed?: boolean;
  children?: ReactElement;
}
class Container<
  P extends ContainerProps,
  S extends ContainerState
> extends Component<P, S> {
  ref: any;
  onLayoutCallback = () => {};

  UNSAFE_componentWillReceiveProps({ changed }: ContainerProps) {
    if (changed && !this.props.changed) {
      this.onSetLayout(null);
    }
  }
  onSetLayout = (e: LayoutChangeEvent | null) => {
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
      <View ref={this.ref} onLayout={(e) => this.onSetLayout(e)}>
        {React.cloneElement(children, {
          layout: this.state.layout,
        })}
      </View>
    );
  }
}

export default Container;
