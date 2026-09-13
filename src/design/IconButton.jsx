import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { colors, radius, spacing } from './theme';

// Rounded icon-only button with optional label below (used for filter chips).
const IconButton = ({ icon: Icon, name, size = 20, color = colors.text, bg = colors.surfaceAlt, onPress, label }) => {
    return (
        <Pressable
            onPress={onPress}
            android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}
            style={({ pressed }) => [
                styles.wrap,
                pressed && { opacity: 0.85 },
            ]}
        >
            <Pressable
                onPress={onPress}
                style={[styles.btn, { backgroundColor: bg }]}
                hitSlop={6}
            >
                {Icon ? <Icon name={name} size={size} color={color} /> : null}
            </Pressable>
            {label ? <Text style={styles.label}>{label}</Text> : null}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
    },
    btn: {
        width: 42,
        height: 42,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginTop: spacing.xs,
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});

export default IconButton;
