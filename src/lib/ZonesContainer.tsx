import React, { ReactElement } from "react";
import { PanResponderGestureState, View, ViewStyle } from "react-native";
import Container, {
  ContainerProps,
  ContainerState,
  Display,
  LayoutProps,
} from "./Container";
import DragZOne from "./DragZone";

interface ZonesContainerState extends ContainerState {
  layout: LayoutProps;
}
interface ZonesContainerProps extends ContainerProps {
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
  itemKeyExtractor: (item: any) => number | string;
  zoneKeyExtractor: (item: any) => number | string;
  itemsDisplay?: Display;
  numCollumns?: number;
  itemsInZoneStyle?: ViewStyle;
  zonesContainerStyle?: ViewStyle;
  onZoneLayoutChange: (zoneId: any, layout: LayoutProps) => any;
  zones: any[];
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
      itemsDisplay,
      numCollumns,
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
              itemsDisplay={itemsDisplay}
              numCollumns={numCollumns}
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
