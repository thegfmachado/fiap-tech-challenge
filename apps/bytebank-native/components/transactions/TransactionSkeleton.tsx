import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming
} from 'react-native-reanimated';

const SkeletonItem = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="flex-row items-center justify-between border-t border-gray-200 py-4 px-7">
      <View className="flex-1">
        <Animated.View 
          style={[
            animatedStyle,
            {
              height: 16,
              backgroundColor: '#e5e7eb',
              borderRadius: 4,
              width: '75%',
              marginBottom: 8
            }
          ]}
        />
        <Animated.View 
          style={[
            animatedStyle,
            {
              height: 14,
              backgroundColor: '#e5e7eb',
              borderRadius: 4,
              width: '50%'
            }
          ]}
        />
      </View>
      <View className="items-end">
        <Animated.View 
          style={[
            animatedStyle,
            {
              height: 16,
              backgroundColor: '#e5e7eb',
              borderRadius: 4,
              width: 80,
              marginBottom: 4
            }
          ]}
        />
      </View>
    </View>
  );
};

export default function TransactionSkeleton({ count = 8 }: { count?: number }) {
  return (
    <View className="flex-1 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
}
