import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, spacing } from './theme';

const EmptyState = ({ title, subtitle, icon: Icon }) => (
    <View style={styles.wrap}>
        {Icon ? (
            <View style={styles.iconWrap}>
                <Icon size={36} color={colors.primary} />
            </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.lg,
    },
    iconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
    },
});

export default EmptyState;
