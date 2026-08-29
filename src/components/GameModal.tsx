import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/styling/theme";

type GameModalProps = {
  visible: boolean;
  title: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  destructive?: boolean;

  onConfirm?: () => void;
  onCancel: () => void;
};

export function GameModal({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText = "CANCEL",
  destructive = false,
  onConfirm,
  onCancel,
}: GameModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Decorative corner elements */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.warningIcon}>
              <Text style={styles.warningText}>
                {destructive ? "!" : "i"}
              </Text>
            </View>

            <Text style={styles.title}>
              {title}
            </Text>
          </View>

          {/* Message */}
          <Text style={styles.message}>
            {message}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>
                {cancelText}
              </Text>
            </Pressable>

            {onConfirm && (
              <Pressable
                style={[
                  styles.confirmButton,
                  destructive && styles.destructiveButton,
                ]}
                onPress={onConfirm}
              >
                <Text
                  style={[
                    styles.confirmText,
                    destructive && styles.destructiveText,
                  ]}
                >
                  {confirmText}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
  
      alignItems: "center",
      justifyContent: "center",
  
      padding: theme.spacing.lg,
  
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  
    modal: {
      width: "100%",
  
      padding: theme.spacing.lg,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
  
      marginBottom: theme.spacing.md,
    },
  
    warningIcon: {
      width: 34,
      height: 34,
  
      alignItems: "center",
      justifyContent: "center",
  
      marginRight: theme.spacing.sm,
  
      borderWidth: 1,
      borderColor: theme.colours.accent,
  
      borderRadius: theme.radius.sm,
    },
  
    warningText: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.accent,
    },
  
    title: {
      flex: 1,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xl,
  
      color: theme.colours.text,
  
      letterSpacing: 1,
    },
  
    message: {
      marginBottom: theme.spacing.lg,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      lineHeight: 21,
  
      color: theme.colours.textMuted,
    },
  
    actions: {
      flexDirection: "row",
  
      gap: theme.spacing.sm,
    },
  
    cancelButton: {
      flex: 1,
  
      minHeight: 50,
  
      alignItems: "center",
      justifyContent: "center",
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.sm,
    },
  
    cancelText: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 1.5,
    },
  
    confirmButton: {
      flex: 1,
  
      minHeight: 50,
  
      alignItems: "center",
      justifyContent: "center",
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.sm,
    },
  
    destructiveButton: {
      backgroundColor: "transparent",
  
      borderWidth: 1,
      borderColor: theme.colours.border,
    },
  
    confirmText: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.background,
  
      letterSpacing: 1.5,
    },
  
    destructiveText: {
      color: theme.colours.textMuted,
    },
  
    corner: {
      position: "absolute",
  
      width: 8,
      height: 8,
  
      borderColor: theme.colours.accent,
    },
  
    cornerTopLeft: {
      top: -1,
      left: -1,
  
      borderTopWidth: 2,
      borderLeftWidth: 2,
    },
  
    cornerTopRight: {
      top: -1,
      right: -1,
  
      borderTopWidth: 2,
      borderRightWidth: 2,
    },
  
    cornerBottomLeft: {
      bottom: -1,
      left: -1,
  
      borderBottomWidth: 2,
      borderLeftWidth: 2,
    },
  
    cornerBottomRight: {
      bottom: -1,
      right: -1,
  
      borderBottomWidth: 2,
      borderRightWidth: 2,
    },
  });