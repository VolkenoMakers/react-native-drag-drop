import React, { Component, ReactElement } from "react";
import { LayoutChangeEvent, View } from "react-native";
export type Display = "row" | "collumn";
export type LayoutProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export interface ContainerState {
  layout: LayoutProps | null;
  mounted: boolean;
}
export interface ContainerProps {
  changed?: boolean | null;
  children?: React.ReactNode;
}
class Container<
  P extends ContainerProps,
  S extends ContainerState
> extends Component<P, S> {
  ref: any;
  onLayoutCallback = () => {};
  UNSAFE_componentWillReceiveProps({ changed }: ContainerProps) {
    if (changed && !this.props.changed && this.state?.mounted) {
      this.onSetLayout(null);
    }
  }
  componentDidMount() {
    this.setState({ mounted: true });
  }
  componentWillUnmount() {
    this.setState({ mounted: false });
  }
  onSetLayout = (e: LayoutChangeEvent | null) => {
    if (this.state?.mounted) {
      if (this.ref.current) {
        if (this.ref.current.measure) {
          this.ref.current.measure(
            (
              fx: number,
              fy: number,
              width: number,
              height: number,
              px: number,
              py: number
            ) => {
              const layout = {
                x: px,
                y: py,
                width,
                height,
              };
              if (this.state?.mounted) {
                this.setState({ layout }, this.onLayoutCallback);
              }
            }
          );
        } else if (e && this.state?.mounted) {
          this.setState(
            { layout: e.nativeEvent.layout },
            this.onLayoutCallback
          );
        }
      } else {
        setTimeout(() => {
          this.onSetLayout(e);
        }, 1000);
      }
    }
  };
  render() {
    const { children } = this.props;
    return (
      <View ref={this.ref} onLayout={(e) => this.onSetLayout(e)}>
        {React.cloneElement(children as ReactElement, {
          layout: this.state.layout,
        })}
      </View>
    );
  }
}

export default Container;
