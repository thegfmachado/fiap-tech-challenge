import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  title?: string;
}

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const weekLength = 7;

export default function CalendarPicker({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
  minimumDate,
  maximumDate,
  title = 'Selecionar data'
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date();
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const endDayOfWeek = lastDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    for (let i = endDayOfWeek; i < 6; i++) {
      days.push(null);
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    if (minimumDate && date < minimumDate) return true;
    if (maximumDate && date > maximumDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color={Colors.light.grayMedium} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">{title}</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1">
          <View className="flex-row items-center justify-between p-4">
            <TouchableOpacity
              onPress={() => navigateMonth('prev')}
              className="p-2 rounded-md bg-gray-100"
            >
              <Ionicons name="chevron-back" size={20} color={Colors.light.grayBlue} />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-gray-900">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>

            <TouchableOpacity
              onPress={() => navigateMonth('next')}
              className="p-2 rounded-md bg-gray-100"
            >
              <Ionicons name="chevron-forward" size={20} color={Colors.light.grayBlue} />
            </TouchableOpacity>
          </View>

          <View className="flex-row px-4 mb-2">
            {weekDays.map((day) => (
              <View key={day} className="flex-1 items-center py-2">
                <Text className="text-sm font-medium text-gray-500">{day}</Text>
              </View>
            ))}
          </View>

          <View className="px-4">
            {Array.from({ length: Math.ceil(days.length / weekLength) }).map((_, weekIndex) => (
              <View key={weekIndex} className="flex-row mb-1">
                {days.slice(weekIndex * weekLength, weekIndex * weekLength + weekLength).map((date, dayIndex) => (
                  <View key={dayIndex} className="flex-1 items-center">
                    {date ? (
                      <TouchableOpacity
                        onPress={() => !isDateDisabled(date) && handleDateSelect(date)}
                        disabled={isDateDisabled(date)}
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          isDateSelected(date)
                            ? 'bg-primary shadow-sm'
                            : isToday(date)
                            ? 'border-2 border-primary'
                            : ''
                        } ${isDateDisabled(date) ? 'opacity-30' : ''}`}
                      >
                        <Text className={`text-sm font-medium ${
                          isDateSelected(date)
                            ? 'text-white'
                            : isToday(date)
                            ? 'text-primary'
                            : isDateDisabled(date)
                            ? 'text-gray-400'
                            : 'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="w-10 h-10" />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View className="p-4 pt-8">
            <TouchableOpacity
              onPress={() => handleDateSelect(new Date())}
              className="flex-row items-center justify-center py-3 px-4 rounded-md border border-gray-300"
            >
              <Ionicons name="today" size={16} color={Colors.light.primary} />
              <Text className="text-sm font-medium text-primary ml-2">
                Selecionar hoje
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
