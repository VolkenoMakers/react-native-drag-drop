import React, { Component } from "react";
import { View } from "react-native";
import DragItem from "./DragItem";

class ItemsContainer extends Component {
  render() {
    const {
      itemsContainerStyle,
      layout,
      dragging,
      itemKeyExtractor,
      onGrant,
      onLayout,
      renderItem,
      onDragEnd,
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
          const layout = this.props.layout;
          if (onLayout) {
            const layout2 = e.nativeEvent.layout;
            if (!layout) {
              onLayout(layout2);
            } else {
              if (
                layout.height < layout2.height ||
                layout.width < layout2.width
              ) {
                onLayout(layout2);
              }
            }
          }
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
