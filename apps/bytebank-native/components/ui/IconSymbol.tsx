// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi) filtering for MaterialCommunityIcons and MaterialIcons.
 * - see SF Symbols in the [SF Symbols](https://github.com/andrewtavis/sf-symbols-online/blob/master/README_dark.md).
 */
const MAPPING_COMMUNITY = {
  'eye': 'eye',
  'eye.slash': 'eye-off',
} as const satisfies Partial<Record<SymbolViewProps['name'], React.ComponentProps<typeof MaterialCommunityIcons>['name']>>;

const MAPPING = {
  'arrow.right.arrow.left': 'compare-arrows',
  'chart.line.uptrend.xyaxis.circle.fill': 'area-chart',
  'chevron.right': 'chevron-right',
  'person.fill': 'person',
  'rectangle.portrait.and.arrow.right': 'logout',
} as const satisfies Partial<Record<SymbolViewProps['name'], React.ComponentProps<typeof MaterialIcons>['name']>>;

type IconSymbolName = keyof typeof MAPPING | keyof typeof MAPPING_COMMUNITY;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  className,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  className?: string;
  weight?: SymbolWeight;
}) {

  if (name in MAPPING_COMMUNITY) {
    return <MaterialCommunityIcons color={color} size={size} name={MAPPING_COMMUNITY[name as keyof typeof MAPPING_COMMUNITY]} className={className} />;
  }

  return <MaterialIcons color={color} size={size} name={MAPPING[name as keyof typeof MAPPING]} className={className} />;
}
