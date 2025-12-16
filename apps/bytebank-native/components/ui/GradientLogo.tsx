import { LinearGradient } from "expo-linear-gradient";

import Logo from '../../assets/images/logo.svg';
import { useThemeColor } from "@/hooks/useThemeColor";

const GRADIENT_START_POINT = 0;
const GRADIENT_TRANSITION_POINT = 0.9;

export function GradientLogo() {
  const backgroundColor = useThemeColor({}, 'background');
  const gradientColor = useThemeColor({}, 'gradient');

  return (
    <LinearGradient
      colors={[backgroundColor, gradientColor]}
      className="flex-col grow min-h-48 justify-center items-center"
      locations={[GRADIENT_START_POINT, GRADIENT_TRANSITION_POINT]}
    >
      <Logo width={224} height={64} />
    </LinearGradient>
  );
}
