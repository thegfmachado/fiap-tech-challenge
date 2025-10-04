/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { LineChart } from "react-native-chart-kit";

const tintColorLight = '#664373';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#664373',
    background: '#fff',
    textOnPrimary: '#fafafa',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gradient: '#DCD4E7',
    lineChartColor: '#664373'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    textOnPrimary: '#fff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    gradient: '#151718',
    lineChartColor: '#664373'
  },
};
