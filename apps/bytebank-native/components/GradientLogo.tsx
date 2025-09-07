import { LinearGradient } from "expo-linear-gradient";

import Logo from '../assets/images/logo.svg';

export function GradientLogo() {
  return (
    <LinearGradient
      colors={['#FFF', '#DCD4E7']}
      className="flex-col grow min-h-48 justify-center items-center"
      locations={[0, 0.9]}
    >
      <Logo width={224} height={64} />
    </LinearGradient>
  );
}
