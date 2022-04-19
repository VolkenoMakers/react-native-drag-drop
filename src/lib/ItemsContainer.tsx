import React, { ReactElement } from "react";
import { PanResponderGestureState, View, ViewStyle } from "react-native";
import Container, {
  ContainerProps,
  ContainerState,
  Display,
  LayoutProps,
} from "./Container";
import DragItem from "./DragItem";

interface ItemsContainerState extends ContainerState {
  layout: LayoutProps | null;
}
interface ItemsContainerProps extends ContainerProps {
  addedHeight: number;
  onDrag: (
    gestureState: PanResponderGestureState,
    layout: LayoutProps | null,
    cb: Function,
    zoneId: any
  ) => any;
  onGrant: (value: boolean) => any;
  onDragEnd: (gesture: PanResponderGestureState) => boolean;
  draggedElementStyle?: ViewStyle;
  layout?: LayoutProps | null;
  style?: ViewStyle;
  dragging: boolean;
  itemsContainerHeightFixe?: boolean;
  itemKeyExtractor: (item: any) => number | string;
  itemsInZoneStyle?: ViewStyle;
  itemsContainerStyle?: ViewStyle;
  onLayout?: (layout: LayoutProps | null) => any;
  items: any[];
  renderItem: (item: any) => ReactElement;
  itemsDisplay?: Display;
  numCollumns?: number;
}
class ItemsContainer extends Container<
  ItemsContainerProps,
  ItemsContainerState
> {
  ref = React.createRef<View>();
  onLayoutCallback = () => {
    if (this.props.onLayout) {
      this.props.onLayout(this.state.layout);
    }
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
      itemsDisplay,
      numCollumns,
    } = this.props;
    const newItemsInZoneStyle: ViewStyle = {};
    const newStyle: ViewStyle = {};
    if (dragging) {
      newStyle.zIndex = 10000;
    }
    if (itemsContainerHeightFixe) {
      newStyle.width = layout?.width;
      newStyle.height = layout?.height;
    }
    if (itemsDisplay === "row") {
      newStyle.flexDirection = "row";
      newStyle.alignItems = "center";
      newStyle.justifyContent = "space-between";
      newStyle.flexWrap = "wrap";
      newItemsInZoneStyle.width = `${
        100 / (numCollumns || 1) - (numCollumns && numCollumns > 0 ? 1 : 0)
      }%`;
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
              itemsInZoneStyle={{ ...itemsInZoneStyle, ...newItemsInZoneStyle }}
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
