import React, { Component } from "react";
import { Dimensions, FlatList, Platform, ScrollView, View } from "react-native";
import Container from "./Container";
import ItemsContainer from "./ItemsContainer";
import ZonesContainer from "./ZonesContainer";

const PERCENT = 0.2;
class DragAndDrop extends Container {
  state = {
    items: this.props.items,
    zones: this.props.zones,
    dragging: false,
    layout: null,
    scrollY: 0,
    counter: 0,
    itemsContainerLayout: null,
    addedHeight: 0,
  };
  interval = null;
  // componentDidMount() {
  //   if (Platform.OS === "ios") {
  //     setTimeout(() => {
  //       this.setState((old) => {
  //         return {
  //           items: old.items.map((i) => ({ ...i, layout: { ...i.layout } })),
  //           zones: old.zones.map((i) => ({ ...i, layout: { ...i.layout } })),
  //         };
  //       });
  //     }, 200);
  //   }
  // }
  onDrag = (gesture, layoutElement, cb, zoneId) => {
    // const cb2 = () => {
    //   setTimeout(() => {
    //     cb();
    //     this.onDrag(gesture, layoutElement, cb, zoneId);
    //   }, 50);
    // };
    // const HEIGHT = this.state.layout.height - layoutElement.height * 0.5;
    const { zoneKeyExtractor } = this.props;
    const x = gesture.moveX;
    const y = gesture.moveY + this.state.scrollY;
    // const div = gesture.moveY / this.state.layout.height;

    // if (div < 1 - PERCENT && div > PERCENT) {
    //   clearTimeout(this.interval);
    //   this.interval = null;
    // }
    // if (!this.interval) {
    //   this.interval = setTimeout(() => {
    //     const div = gesture.moveY / this.state.layout.height;
    //     let added = parseInt(HEIGHT * (1 - PERCENT));
    //     if (div >= 1 - PERCENT) {
    //       let rest =
    //         this.state.contentSize.height -
    //         this.state.scrollY -
    //         this.state.layout.height;
    //       if (parseInt(rest) >= 0) {
    //         if (rest <= added) {
    //           this.setState(
    //             { addedHeight: this.state.addedHeight + rest },
    //             cb2
    //           );
    //           this.ref.current.scrollToOffset({
    //             animated: true,
    //             offset: this.state.scrollY + rest,
    //           });
    //         } else {
    //           this.setState(
    //             { addedHeight: this.state.addedHeight + added },
    //             cb2
    //           );
    //           this.ref.current.scrollToOffset({
    //             animated: true,
    //             offset: this.state.scrollY + added,
    //           });
    //         }
    //       }
    //     } else if (div <= PERCENT) {
    //       if (this.state.scrollY > 0) {
    //         let rest = this.state.scrollY - added;
    //         if (parseInt(rest) <= 0) {
    //           this.setState(
    //             { addedHeight: this.state.addedHeight - this.state.scrollY },
    //             cb2
    //           );
    //           this.ref.current.scrollToOffset({ animated: true, offset: 0 });
    //         } else {
    //           this.setState(
    //             { addedHeight: this.state.addedHeight - added },
    //             cb2
    //           );
    //           this.ref.current.scrollToOffset({
    //             animated: true,

    //             offset: Math.abs(this.state.scrollY - added),
    //           });
    //         }
    //       }
    //     }
    //     this.interval = null;
    //   }, 800);
    // }

    const zones = [...this.state.zones];
    for (let z of zones) {
      if (zoneKeyExtractor(z) === zoneId) {
        z.dragged = true;
      }
      const { layout } = z;
      const offsetTop = layout.y - layoutElement.height * 0.3;
      const offsetBottom =
        layout.y + layout.height + layoutElement.height * 0.3;
      const offsetLeft = layout.x - layoutElement.width * 0.3;
      const offsetRight = layout.x + layout.width + layoutElement.width * 0.3;

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
    this.setState({ addedHeight: 0 });
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }
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
      itemsContainerHeightFixe = true,
      contentContainerStyle,
      itemsInZoneStyle,
      style,
    } = this.props;
    const { items, zones, dragging, layout, itemsContainerLayout } = this.state;
    if (this.state.changed) return <View style={style} />;
    const otherStyle = {};
    if (this.state.dragging) {
      otherStyle.zIndex = 2;
      otherStyle.elevation = 2;
    }

    return (
      <FlatList
        onContentSizeChange={(width, height) =>
          this.setState({ contentSize: { width, height } })
        }
        scrollEnabled={Platform.OS === "ios" ? !this.state.dragging : true}
        style={[{ flex: 1, backgroundColor: "#CCC" }, style, otherStyle]}
        onScroll={(e) => {
          this.setState({ scrollY: e.nativeEvent.contentOffset.y });
        }}
        contentContainerStyle={[contentContainerStyle, otherStyle]}
        keyExtractor={() => "1"}
        ref={this.ref}
        onLayout={(e) => this.onSetLayout(e)}
        renderItem={() => {
          return (
            <React.Fragment>
              <ItemsContainer
                itemsContainerStyle={itemsContainerStyle}
                dragging={dragging}
                itemKeyExtractor={itemKeyExtractor}
                addedHeight={this.state.addedHeight}
                onGrant={(grant) => this.setState({ dragging: grant })}
                renderItem={renderItem}
                layout={itemsContainerLayout}
                onLayout={(layout) =>
                  this.setState({ itemsContainerLayout: layout })
                }
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
                addedHeight={this.state.addedHeight}
                onGrant={(grant) => this.setState({ dragging: grant })}
                itemsInZoneStyle={itemsInZoneStyle}
                onZoneLayoutChange={(key, layout) => {
                  const zones = [...this.state.zones];
                  const index = zones.findIndex(
                    (z) => zoneKeyExtractor(z) === key
                  );
                  zones[index].layout = layout;
                  this.setState({ zones });
                }}
                zonesContainerStyle={zonesContainerStyle}
                itemKeyExtractor={itemKeyExtractor}
                renderItem={renderItem}
                onDragEnd={this.onDragEnd}
                onDrag={this.onDrag}
              />
            </React.Fragment>
          );
        }}
        data={[1]}
      />
    );
  }
}

export default DragAndDrop;
