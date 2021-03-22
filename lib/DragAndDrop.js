import React, { Component } from "react";
import { Platform, ScrollView, View } from "react-native";
import ItemsContainer from "./ItemsContainer";
import ZonesContainer from "./ZonesContainer";

class DragAndDrop extends Component {
  state = {
    items: this.props.items,
    zones: this.props.zones,
    dragging: false,
    layout: null,
    scrollY: 10,

    itemsContainerLayout: null,
  };

  componentDidMount() {
    if (Platform.OS === "ios") {
      setTimeout(() => {
        this.setState((old) => {
          return {
            items: old.items.map((i) => ({ ...i, layout: { ...i.layout } })),
            zones: old.zones.map((i) => ({ ...i, layout: { ...i.layout } })),
          };
        });
      }, 200);
    }
  }
  onDrag = (gesture, layoutElement, cb, zoneId) => {
    const { zoneKeyExtractor } = this.props;
    const x = gesture.moveX;
    const y = gesture.moveY;

    const zones = [...this.state.zones];
    for (let z of zones) {
      if (zoneKeyExtractor(z) === zoneId) {
        z.dragged = true;
      }
      const { layout } = z;
      const offsetTop = layout.y - layoutElement.height * -0.1;
      const offsetBottom =
        layout.y + layout.height + layoutElement.height * -0.1;
      const offsetLeft = layout.x - layoutElement.width * -0.1;
      const offsetRight = layout.x + layout.width + layoutElement.width * -0.1;

      if (
        offsetTop <= y &&
        offsetBottom >= y &&
        offsetLeft <= x &&
        offsetRight >= x
      ) {
        for (let z2 of zones) {
          if (z2 === z) {
            z.layout.hover = true;
          } else {
            z2.layout.hover = false;
          }
        }
      } else {
        zones[zones.indexOf(z)].layout.hover = false;
      }
    }
    this.setState({ zones });
  };
  onDragEnd = (item) => {
    const { itemKeyExtractor: ke, onMaj } = this.props;
    let zones = [...this.state.zones];
    let items = [...this.state.items];
    const hoverIndex = zones.findIndex((z) => z.layout.hover);
    if (hoverIndex === -1) {
      this.setState({ itemsContainerLayout: null });
      let itemsIndex = items.findIndex((i) => ke(i) === ke(item));
      if (itemsIndex === -1) {
        items.push(item);
        for (let z of zones) {
          z.items = z.items?.filter((i) => ke(i) !== ke(item));
        }
      }
    } else {
      items = items.filter((i) => ke(i) !== ke(item));
      let zone = zones[hoverIndex];
      for (let z of zones) {
        if (z === zone) {
          if (!zone.items) {
            zone.items = [item];
          } else {
            let itemIndex = zone?.items.findIndex((i) => ke(i) === ke(item));
            if (itemIndex === -1) {
              zone.items.push(item);
            }
          }
        } else {
          z.items = z.items?.filter((i) => ke(i) !== ke(item));
        }
      }
    }
    for (let z of zones) {
      z.layout.hover = false;
      z.dragged = false;
    }
    this.setState({ changed: true }, () => {
      this.setState({ changed: false }, () => {
        this.setState({ zones, items });
      });
    });
    onMaj(
      zones.map((z) => {
        const { layout, dragged, ...rest } = z;
        return rest;
      }),
      items
    );
    return false;
  };

  render() {
    const {
      itemKeyExtractor,
      zoneKeyExtractor,
      renderItem,
      renderZone,
      itemsContainerStyle,
      zonesContainerStyle,
      itemsContainerHeightFixe,
      contentContainerStyle,
      itemsInZoneStyle,
      style,
    } = this.props;
    const { items, zones, dragging, layout, itemsContainerLayout } = this.state;
    if (this.state.changed) return <View style={style} />;
    return (
      <ScrollView
        scrollEnabled={Platform.OS === "ios" ? !this.state.dragging : true}
        style={[{ flex: 1 }, style]}
        contentContainerStyle={contentContainerStyle}
        onLayout={(e) => this.setState({ layout: e.nativeEvent.layout })}
      >
        <ItemsContainer
          itemsContainerStyle={itemsContainerStyle}
          dragging={dragging}
          itemKeyExtractor={itemKeyExtractor}
          onGrant={(grant) => this.setState({ dragging: grant })}
          renderItem={renderItem}
          layout={itemsContainerLayout}
          onLayout={(layout) => this.setState({ itemsContainerLayout: layout })}
          onDragEnd={this.onDragEnd}
          itemsContainerHeightFixe={itemsContainerHeightFixe}
          onDrag={this.onDrag}
          items={items}
        />
        <ZonesContainer
          renderZone={renderZone}
          zones={zones}
          layout={layout}
          zoneKeyExtractor={zoneKeyExtractor}
          onGrant={(grant) => this.setState({ dragging: grant })}
          itemsInZoneStyle={itemsInZoneStyle}
          onZoneLayoutChange={(key, layout) => {
            const zones = [...this.state.zones];
            const index = zones.findIndex((z) => zoneKeyExtractor(z) === key);
            zones[index].layout = layout;
            this.setState({ zones });
          }}
          zonesContainerStyle={zonesContainerStyle}
          itemKeyExtractor={itemKeyExtractor}
          renderItem={renderItem}
          onDragEnd={this.onDragEnd}
          onDrag={this.onDrag}
        />
      </ScrollView>
    );
  }
}

export default DragAndDrop;
