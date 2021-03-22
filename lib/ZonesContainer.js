import React from "react";
import { View } from "react-native";
import Container from "./Container";
import DragZOne from "./DragZone";

class ZonesContainer extends Container {
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
      onDrag,
      zones,
      renderZone,
    } = this.props;
    return (
      <View onLayout={this.onSetLayout} style={zonesContainerStyle}>
        {zones.map((zone) => {
          const key = zoneKeyExtractor(zone);
          return (
            <DragZOne
              onZoneLayoutChange={onZoneLayoutChange}
              zoneId={key}
              key={key}
              layout={this.state.layout}
              renderItem={renderItem}
              onGrant={onGrant}
              onDragEnd={onDragEnd}
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
