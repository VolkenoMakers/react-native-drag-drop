import React, { ReactElement } from "react";
import { View } from "react-native";
import DragZOne from "./DragZone";
import { PanResponderGestureState, ViewStyle } from "react-native";
import Container, {
  ContainerProps,
  ContainerState,
  LayoutProps,
} from "./Container";

interface ZonesContainerState extends ContainerState {
  layout: LayoutProps;
}
interface ZonesContainerProps extends ContainerProps {
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
  itemKeyExtractor: (item: any) => number | string;
  zoneKeyExtractor: (item: any) => number | string;

  itemsInZoneStyle?: ViewStyle;
  zonesContainerStyle?: ViewStyle;
  onZoneLayoutChange: (zoneId: any, layout: LayoutProps) => any;
  zones: [any];
  renderItem: (item: any) => ReactElement;
  renderZone: (
    zone: any,
    children?: ReactElement,
    hover?: boolean
  ) => ReactElement;
}
class ZonesContainer extends Container<
  ZonesContainerProps,
  ZonesContainerState
> {
  ref = React.createRef<View>();
  render() {
    const {
      itemKeyExtractor,
      renderItem,
      zonesContainerStyle,
      onZoneLayoutChange,
      onDragEnd,
      zoneKeyExtractor,
      itemsInZoneStyle,
      onGrant,
      changed,
      onDrag,
      zones,
      renderZone,
      draggedElementStyle,
      addedHeight,
    } = this.props;
    return (
      <View style={zonesContainerStyle}>
        {zones.map((zone) => {
          const key = zoneKeyExtractor(zone);
          return (
            <DragZOne
              onZoneLayoutChange={onZoneLayoutChange}
              zoneId={key}
              key={key}
              renderItem={renderItem}
              addedHeight={addedHeight}
              changed={changed}
              onGrant={onGrant}
              onDragEnd={onDragEnd}
              draggedElementStyle={draggedElementStyle}
              zone={zone}
              itemsInZoneStyle={itemsInZoneStyle}
              itemKeyExtractor={itemKeyExtractor}
              onDrag={onDrag}
              renderZone={renderZone}
            />
          );
        })}
      </View>
    );
  }
}

export default ZonesContainer;
