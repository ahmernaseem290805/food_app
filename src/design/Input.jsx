import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { colors, radius, spacing } from './theme';

const Input = ({
    icon: Icon,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    autoCorrect,
    editable = true,
    multiline = false,
    style,
    inputStyle,
    rightSlot,
}) => (
    <View style={[styles.wrap, !editable && styles.disabled, style]}>
        {Icon ? <Icon size={20} color={colors.primary} style={{ marginRight: spacing.sm }} /> : null}
        <TextInput
            style={[styles.input, multiline && { height: 90, textAlignVertical: 'top' }, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            editable={editable}
            multiline={multiline}
        />
        {rightSlot}
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        marginBottom: spacing.md,
    },
    disabled: {
        backgroundColor: colors.surfaceAlt,
        opacity: 0.9,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        color: colors.text,
        fontSize: 15,
    },
});

export default Input;
