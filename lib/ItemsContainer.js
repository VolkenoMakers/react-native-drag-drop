import React from "react";
import { View } from "react-native";
import Container from "./Container";
import DragItem from "./DragItem";

class ItemsContainer extends Container {
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
      itemsInZoneStyle,
      items,
    } = this.props;
    const newStyle = {};
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
          this.onSetLayout();
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
