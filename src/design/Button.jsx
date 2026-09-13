import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { colors, radius, shadows, spacing } from './theme';

// Variants: 'primary' | 'secondary' | 'ghost' | 'soft'
const Button = ({
    title,
    onPress,
    variant = 'primary',
    disabled,
    loading,
    iconLeft: IconLeft,
    style,
    textStyle,
    size = 'md',
}) => {
    const palette = VARIANTS[variant];
    const sizing = SIZE[size];

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            android_ripple={{ color: 'rgba(255,255,255,0.18)' }}
            style={({ pressed }) => [
                styles.base,
                sizing.container,
                palette.container,
                variant === 'primary' && shadows.sm,
                pressed && { opacity: 0.9 },
                disabled && { opacity: 0.5 },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={palette.text.color} />
            ) : (
                <>
                    {IconLeft ? <IconLeft size={sizing.icon} color={palette.text.color} /> : null}
                    <Text style={[styles.text, sizing.text, palette.text, textStyle]}>{title}</Text>
                </>
            )}
        </Pressable>
    );
};

const VARIANTS = {
    primary: {
        container: { backgroundColor: colors.primary },
        text: { color: colors.textOnPrimary },
    },
    secondary: {
        container: {
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: colors.primary,
        },
        text: { color: colors.primary },
    },
    ghost: {
        container: { backgroundColor: 'transparent' },
        text: { color: colors.primary },
    },
    soft: {
        container: { backgroundColor: colors.primarySoft },
        text: { color: colors.primaryDark },
    },
    dark: {
        container: { backgroundColor: colors.accent },
        text: { color: colors.textOnPrimary },
    },
};

const SIZE = {
    sm: {
        container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
        text: { fontSize: 14 },
        icon: 16,
    },
    md: {
        container: { paddingVertical: 14, paddingHorizontal: spacing.xl },
        text: { fontSize: 16 },
        icon: 18,
    },
    lg: {
        container: { paddingVertical: 18, paddingHorizontal: spacing.xxl },
        text: { fontSize: 17 },
        icon: 20,
    },
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        borderRadius: radius.pill,
        alignSelf: 'stretch',
    },
    text: {
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default Button;
