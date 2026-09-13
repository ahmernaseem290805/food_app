import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, radius, spacing } from './theme';

// Branded colored header with optional leading/trailing icons.
const ScreenHeader = ({
    title,
    subtitle,
    iconLeft: IconLeft,
    onLeftPress,
    iconRight: IconRight,
    onRightPress,
    rightLabel,
    bg = colors.primary,
    titleColor = colors.textOnPrimary,
    subtitleColor = 'rgba(255,255,255,0.85)',
    children,
}) => (
    <View style={[styles.wrap, { backgroundColor: bg }]}>
        <View style={styles.row}>
            {IconLeft ? (
                <Pressable
                    onPress={onLeftPress}
                    hitSlop={10}
                    style={styles.iconBtn}
                >
                    <IconLeft size={22} color={titleColor} />
                </Pressable>
            ) : (
                <View style={styles.iconBtn} />
            )}
            <View style={styles.titles}>
                <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
                {subtitle ? (
                    <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
                ) : null}
            </View>
            {IconRight ? (
                <Pressable onPress={onRightPress} hitSlop={10} style={styles.iconBtn}>
                    <IconRight size={22} color={titleColor} />
                </Pressable>
            ) : rightLabel ? (
                <Pressable onPress={onRightPress} hitSlop={8} style={styles.iconBtn}>
                    <Text style={[styles.rightLabel, { color: titleColor }]}>{rightLabel}</Text>
                </Pressable>
            ) : (
                <View style={styles.iconBtn} />
            )}
        </View>
        {children}
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titles: {
        flex: 1,
        marginHorizontal: spacing.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    rightLabel: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default ScreenHeader;
