import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { colors, radius, spacing } from './theme';

const Chip = ({ label, active, onPress, color }) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                active && styles.active,
                color && !active ? { backgroundColor: color } : null,
                pressed && { opacity: 0.85 },
            ]}
        >
            <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: radius.pill,
        backgroundColor: colors.surfaceAlt,
        marginRight: spacing.sm,
    },
    active: {
        backgroundColor: colors.accent,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeLabel: {
        color: colors.textOnPrimary,
    },
});

export default Chip;
