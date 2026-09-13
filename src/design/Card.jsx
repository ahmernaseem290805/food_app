import { StyleSheet, View } from 'react-native';
import React from 'react';
import { colors, radius, shadows, spacing } from './theme';

const Card = ({ children, style, padded = true, raised = false, color }) => (
    <View
        style={[
            styles.base,
            padded && styles.padded,
            raised ? shadows.md : shadows.sm,
            color ? { backgroundColor: color } : null,
            style,
        ]}
    >
        {children}
    </View>
);

const styles = StyleSheet.create({
    base: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    padded: {
        padding: spacing.lg,
    },
});

export default Card;
