import React, { ReactElement } from "react";
import { PanResponderGestureState, ScrollView } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheet";
import Container, {
  ContainerProps,
  ContainerState,
  LayoutProps,
} from "./Container";
import ItemsContainer from "./ItemsContainer";
import ZonesContainer from "./ZonesContainer";
interface DragAndDropState extends ContainerState {
  items: [any];
  zones: [any];
  dragging: boolean;
  layout: LayoutProps;
  scrollY: number;
  changed?: boolean;
  contentSize?: {
    width: number;
    height: number;
  };
  counter: number;
  itemsContainerLayout: LayoutProps;
  addedHeight: number;
}
interface DragAndDropProps extends ContainerProps {
  items: [any];
  zones: [any];
  zoneKeyExtractor: (zone: any) => string | number;
  itemKeyExtractor: (zone: any) => string | number;
  maxItemsPerZone?: number;
  onMaj: (zones: [any], items: [any]) => any;
  itemsInZoneStyle?: ViewStyle;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  draggedElementStyle?: ViewStyle;
  headerComponent?: ReactElement;
  footerComponent?: ReactElement;
  itemsContainerHeightFixe?: boolean;
  renderItem: (item: any) => ReactElement;
  itemsContainerStyle?: ViewStyle;
  zonesContainerStyle?: ViewStyle;
  renderZone: (
    zone: any,
    children?: ReactElement,
    hover?: boolean
  ) => ReactElement;
}

const PERCENT = 0.15;
class DragAndDrop extends Container<DragAndDropProps, DragAndDropState> {
  state = {
    items: this.props.items,
    zones: this.props.zones,
    dragging: false,
    layout: null,
    changed: null,
    contentSize: null,
    scrollY: 0,
    counter: 0,
    itemsContainerLayout: null,
    addedHeight: 0,
  };
  timeout = null;
  ref = React.createRef<ScrollView>();
  onDrag = (
    gesture: PanResponderGestureState,
    layoutElement: LayoutProps,
    cb: Function,
    zoneId: any
  ) => {
    const cb2 = () => {
      setTimeout(() => {
        if (this.state.dragging) {
          cb();
          this.onDrag(gesture, layoutElement, cb, zoneId);
        }
      }, 400);
    };
    const HEIGHT = this.state.layout.height - layoutElement?.height * 0.5;
    const { zoneKeyExtractor } = this.props;
    const x = gesture.moveX;
    const y = gesture.dy + layoutElement?.y + this.state.addedHeight;
    const div = gesture.moveY / this.state.layout.height;
    if (div < 1 - PERCENT && div > PERCENT) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        const div = gesture.moveY / this.state.layout.height;
        let added = parseInt(String(HEIGHT * 0.5));
        if (div >= 1 - PERCENT) {
          let rest: number =
            this.state.contentSize.height -
            this.state.scrollY -
            this.state.layout.height;
          if (parseInt(String(rest)) >= 0) {
            if (rest <= added) {
              this.setState(
                { addedHeight: this.state.addedHeight + rest },
                cb2
              );
              this.ref.current.scrollTo({
                animated: true,
                y: this.state.scrollY + rest,
              });
            } else {
              this.setState(
                { addedHeight: this.state.addedHeight + added },
                cb2
              );
              this.ref.current.scrollTo({
                animated: true,
                y: this.state.scrollY + added,
              });
            }
          }
        } else if (div <= PERCENT) {
          if (this.state.scrollY > 0) {
            let rest: number = this.state.scrollY - added;
            if (parseInt(String(rest)) <= 0) {
              this.setState(
                { addedHeight: this.state.addedHeight - this.state.scrollY },
                cb2
              );
              this.ref.current.scrollTo({ animated: true, y: 0 });
            } else {
              this.setState(
                { addedHeight: this.state.addedHeight - added },
                cb2
              );
              this.ref.current.scrollTo({
                animated: true,

                y: Math.abs(this.state.scrollY - added),
              });
            }
          }
        }
        this.timeout = null;
      }, 800);
    }

    const zones: [any] = [...this.state.zones];
    for (let z of zones) {
      if (zoneKeyExtractor(z) === zoneId) {
        z.dragged = true;
      }
      const { layout } = z;
      const offsetTop = layout.y - layoutElement?.height * 0.3;
      const offsetBottom =
        layout.y + layout.height + layoutElement?.height * 0.3;
      const offsetLeft = layout.x - layoutElement?.width * 0.3;
      const offsetRight = layout.x + layout.width + layoutElement?.width * 0.3;

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
    const oldItems = this.state.items.map((i) => ({ ...i }));
    const oldZones = this.state.zones.map((i) => ({ ...i }));
    const { maxItemsPerZone } = this.props;
    let ok = true;
    this.setState({ addedHeight: 0 });
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    const { itemKeyExtractor: ke, onMaj } = this.props;
    let zones = [...this.state.zones];
    let items = [...this.state.items];
    const hoverIndex = zones.findIndex((z) => z.layout.hover);
    if (hoverIndex === -1) {
      let itemsIndex = items.findIndex((i) => ke(i) === ke(item));
      if (itemsIndex === -1) {
        items.push(item);
        for (let z of zones) {
          z.items = z.items?.filter((i) => ke(i) !== ke(item));
        }
      }
    } else {
      items = items.filter((i) => ke(i) !== ke(item));
      const zone = zones[hoverIndex];
      for (let z of zones) {
        if (z === zone) {
          if (!zone.items) {
            zone.items = [item];
          } else {
            let itemIndex = zone?.items.findIndex((i) => ke(i) === ke(item));
            if (itemIndex === -1) {
              ReactNodeArray;
              if (maxItemsPerZone && maxItemsPerZone === zone.items.length) {
                ok = false;
              } else {
                zone.items.push(item);
              }
            }
          }
        } else {
          z.items = z.items?.filter((i) => ke(i) !== ke(item));
        }
      }
    }
    if (ok) {
      for (let z of zones) {
        z.layout.hover = false;
        z.dragged = false;
      }
      this.setState({ changed: true }, () => {
        this.setState({ changed: false }, () => {
          //@ts-ignore
          this.setState({ zones, items });
        });
      });
      onMaj(
        //@ts-ignore
        zones.map((z: any) => {
          const { layout, dragged, ...rest } = z;
          return rest;
        }),
        items
      );
    } else {
      for (let z of oldZones) {
        z.layout.hover = false;
        z.dragged = false;
      }
      this.setState({ changed: true }, () => {
        this.setState({ changed: false }, () => {
          //@ts-ignore
          this.setState({ zones: oldZones, items: oldItems });
        });
      });
    }

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
      itemsContainerHeightFixe = true,
      draggedElementStyle,
      contentContainerStyle,
      itemsInZoneStyle,
      style,
      headerComponent,
      footerComponent,
    } = this.props;
    const { items, zones, dragging, itemsContainerLayout } = this.state;
    // if (this.state.changed) return <View style={style} />;
    const otherStyle: ViewStyle = {};
    if (this.state.dragging) {
      otherStyle.zIndex = 2;
      otherStyle.elevation = 2;
    }
    return (
      <ScrollView
        onContentSizeChange={(width, height) => {
          this.setState({ contentSize: { width, height } });
          this.onSetLayout(null);
        }}
        disableScrollViewPanResponder={true}
        scrollEnabled={!this.state.dragging}
        style={[{ flex: 1, backgroundColor: "#CCC" }, style, otherStyle]}
        onScroll={(e) => {
          let y = e.nativeEvent.contentOffset.y;
          this.setState({ scrollY: y });
        }}
        scrollEventThrottle={400}
        contentContainerStyle={[contentContainerStyle, otherStyle]}
        ref={this.ref}
        onLayout={(e) => this.onSetLayout(e)}
      >
        {headerComponent}
        <ItemsContainer
          itemsContainerStyle={itemsContainerStyle}
          dragging={dragging}
          itemKeyExtractor={itemKeyExtractor}
          addedHeight={this.state.addedHeight}
          onGrant={(grant) => this.setState({ dragging: grant })}
          renderItem={renderItem}
          draggedElementStyle={draggedElementStyle}
          changed={this.state.changed}
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
          zoneKeyExtractor={zoneKeyExtractor}
          changed={this.state.changed}
          addedHeight={this.state.addedHeight}
          draggedElementStyle={draggedElementStyle}
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
        {footerComponent}
      </ScrollView>
    );
  }
}

export default DragAndDrop;
