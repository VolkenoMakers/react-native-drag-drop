import React, { Component } from "react";
import { View } from "react-native";
import DragZOne from "./DragZone";

class ZonesContainer extends Component {
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
