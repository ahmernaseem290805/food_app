import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, spacing } from './theme';

const SectionTitle = ({ title, actionLabel, onAction, style }) => (
    <View style={[styles.row, style]}>
        <Text style={styles.title}>{title}</Text>
        {actionLabel ? (
            <Pressable onPress={onAction} hitSlop={8}>
                <Text style={styles.action}>{actionLabel}</Text>
            </Pressable>
        ) : null}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.2,
    },
    action: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary,
    },
});

export default SectionTitle;
