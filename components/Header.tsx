import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MenuItem = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  title: string;
  menuItems: MenuItem[];
};

export function Header({ title, menuItems }: Props) {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  function toggleMenu() {
    const toValue = open ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
    setOpen(!open);
  }

  function handleItem(onPress: () => void) {
    toggleMenu();
    setTimeout(onPress, 150);
  }

  const menuTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  const menuOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View>
      {/* Bar */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
        <Text className="text-lg font-bold tracking-wide">{title}</Text>
        <Pressable onPress={toggleMenu} hitSlop={12} className="h-8 w-8 items-center justify-center">
          <HamburgerIcon open={open} />
        </Pressable>
      </View>

      {/* Dropdown */}
      {open && (
        <>
          <Pressable
            onPress={toggleMenu}
            style={{ position: "absolute", top: 56, left: 0, right: 0, bottom: -9999, zIndex: 10 }}
          />
          <Animated.View
            style={{
              opacity: menuOpacity,
              transform: [{ translateY: menuTranslateY }],
              position: "absolute",
              top: 56,
              right: 16,
              zIndex: 20,
              minWidth: 180,
              borderRadius: 14,
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              overflow: "hidden",
            }}
          >
            {menuItems.map((item, index) => (
              <View key={item.label}>
                {index > 0 && <View style={{ marginHorizontal: 12, borderBottomWidth: 1, borderColor: "#f3f4f6" }} />}
                <TouchableOpacity onPress={() => handleItem(item.onPress)} activeOpacity={0.6} style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                  <Text style={{ fontSize: 14, fontWeight: "500", color: item.destructive ? "#ef4444" : "#1f2937" }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <View style={{ gap: 4 }}>
      <View style={{ height: 2, width: 20, borderRadius: 2, backgroundColor: "#1f2937", transform: open ? [{ rotate: "45deg" }, { translateY: 6 }] : [] }} />
      <View style={{ height: 2, width: 20, borderRadius: 2, backgroundColor: "#1f2937", opacity: open ? 0 : 1 }} />
      <View style={{ height: 2, width: 20, borderRadius: 2, backgroundColor: "#1f2937", transform: open ? [{ rotate: "-45deg" }, { translateY: -6 }] : [] }} />
    </View>
  );
}