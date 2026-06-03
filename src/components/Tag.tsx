import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { categoryStyle, colors, modalityStyle, fonts } from '@/theme';
import { Category, Modality } from '@/types';

interface TagBaseProps {
  children: React.ReactNode;
  bg: string;
  fg: string;
}

const TagBase = ({ children, bg, fg }: TagBaseProps) => (
  <View style={[styles.tag, { backgroundColor: bg }]}>
    <Text style={[styles.tagText, { color: fg }]}>{children}</Text>
  </View>
);

export const CategoryTag = ({ category }: { category: Category }) => {
  const style = categoryStyle[category] || {
    bg: colors.gray200,
    fg: colors.gray600,
    emoji: '📌',
  };
  return (
    <TagBase bg={style.bg} fg={style.fg}>
      {style.emoji} {category || 'Geral'}
    </TagBase>
  );
};

export const ModalityTag = ({ modality }: { modality: Modality }) => {
  const style = modalityStyle[modality] || { bg: colors.gray200, fg: colors.gray600 };
  return (
    <TagBase bg={style.bg} fg={style.fg}>
      🏠 {modality}
    </TagBase>
  );
};

export const AvailabilityTag = ({ availability }: { availability: string }) => (
  <TagBase bg={colors.tagWkndBg} fg={colors.tagWkndFg}>
    📅 {availability}
  </TagBase>
);

export const StatusBadge = ({ status }: { status: string }) => {
  const active = status === 'Ativa';
  return (
    <TagBase
      bg={active ? colors.tagEduBg : colors.gray200}
      fg={active ? colors.tagEduFg : colors.gray600}
    >
      {status}
    </TagBase>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    fontFamily: fonts.sansBold,
  },
});
