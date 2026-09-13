import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, radius, spacing } from './theme';

// Small pill used for status badges ("pending", "Free delivery", ratings…).
const Tag = ({ label, color = colors.primary, bg, icon: Icon }) => (
    <View style={[styles.wrap, { backgroundColor: bg || color + '1A' }]}>
        {Icon ? <Icon size={12} color={color} /> : null}
        <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: radius.pill,
        gap: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
});

export default Tag;
