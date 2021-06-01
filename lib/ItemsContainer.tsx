import React, { ReactElement, ReactNodeArray } from "react";
import { View } from "react-native";
import DragItem from "./DragItem";
import { PanResponderGestureState, ViewStyle } from "react-native";
import Container, {
  ContainerProps,
  ContainerState,
  LayoutProps,
} from "./Container";

interface ItemsContainerState extends ContainerState {
  layout: LayoutProps;
}
interface ItemsContainerProps extends ContainerProps {
  addedHeight: number;
  onDrag: (
    gestureState: PanResponderGestureState,
    layout: LayoutProps,
    cb: Function,
    zoneId: any
  ) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  layout?: LayoutProps;
  style?: ViewStyle;
  dragging: boolean;
  itemsContainerHeightFixe?: boolean;
  itemKeyExtractor: (item: any) => number | string;
  itemsInZoneStyle?: ViewStyle;
  itemsContainerStyle?: ViewStyle;
  onLayout?: (layout: LayoutProps) => any;
  items: [any];
  renderItem: (item: any) => ReactElement;
}
class ItemsContainer extends Container<
  ItemsContainerProps,
  ItemsContainerState
> {
  ref = React.createRef<View>();
  onLayoutCallback = () => {
    this.props.onLayout(this.state.layout);
  };
  render() {
    const {
      itemsContainerStyle,
      layout,
      dragging,
      itemKeyExtractor,
      onGrant,
      addedHeight,
      renderItem,
      onDragEnd,
      changed,
      onDrag,
      itemsContainerHeightFixe,
      draggedElementStyle,
      itemsInZoneStyle,
      items,
    } = this.props;
    const newStyle: ViewStyle = {};
    if (dragging) {
      newStyle.zIndex = 10000;
    }
    if (itemsContainerHeightFixe) {
      newStyle.width = layout?.width;
      newStyle.height = layout?.height;
    }

    return (
      <View
        onLayout={(e) => {
          this.onSetLayout(e);
        }}
        style={[itemsContainerStyle, newStyle]}
      >
        {items.map((item) => {
          const key = itemKeyExtractor(item);
          return (
            <DragItem
              key={key}
              onDrag={onDrag}
              onGrant={onGrant}
              changed={changed}
              draggedElementStyle={draggedElementStyle}
              addedHeight={addedHeight}
              itemsInZoneStyle={itemsInZoneStyle}
              onDragEnd={onDragEnd}
              item={item}
              renderItem={renderItem}
            />
          );
        })}
      </View>
    );
  }
}

export default ItemsContainer;
