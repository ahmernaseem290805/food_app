import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, radius } from './theme';

const initials = (s = '') =>
    s
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('') || '?';

const Avatar = ({ name, size = 44, bg = colors.primary, color = colors.textOnPrimary }) => (
    <View
        style={[
            styles.avatar,
            {
                width: size,
                height: size,
                borderRadius: radius.pill,
                backgroundColor: bg,
            },
        ]}
    >
        <Text
            style={[
                styles.text,
                { color, fontSize: size * 0.4 },
            ]}
        >
            {initials(name)}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: '800',
        letterSpacing: 0.4,
    },
});

export default Avatar;
