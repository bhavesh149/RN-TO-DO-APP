import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GradientView } from '@/components/ui/GradientView';
import { PriorityColors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => void;
  type: 'project' | 'task';
  title?: string;
}

export function AddItemModal({
  visible,
  onClose,
  onSubmit,
  type,
  title = '',
}: AddItemModalProps) {
  const [itemTitle, setItemTitle] = useState(title);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  
  const handleSubmit = () => {
    if (itemTitle.trim()) {
      onSubmit(itemTitle.trim(), type === 'project' ? description.trim() : undefined, priority);
      setItemTitle('');
      setDescription('');
      setPriority('medium');
      onClose();
    }
  };
  
  const handleClose = () => {
    setItemTitle('');
    setDescription('');
    setPriority('medium');
    onClose();
  };
  
  React.useEffect(() => {
    if (visible) {
      setItemTitle(title);
      setDescription('');
      setPriority('medium');
    }
  }, [visible, title]);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              <ThemedView style={[styles.modal, { backgroundColor: surface }]}>
                <View style={styles.header}>
                  <ThemedText type="title" style={styles.modalTitle}>
                    Add {type === 'project' ? 'Project' : 'Task'}
                  </ThemedText>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={textSecondary} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.content}>
                  <View style={styles.inputContainer}>
                    <ThemedText style={[styles.label, { color: textSecondary }]}>
                      {type === 'project' ? 'Project' : 'Task'} Name *
                    </ThemedText>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: background,
                          borderColor,
                          color: textColor,
                        },
                      ]}
                      value={itemTitle}
                      onChangeText={setItemTitle}
                      placeholder={`Enter ${type} name...`}
                      placeholderTextColor={textSecondary}
                      multiline={false}
                      autoFocus
                    />
                  </View>
                  
                  {type === 'project' && (
                    <View style={styles.inputContainer}>
                      <ThemedText style={[styles.label, { color: textSecondary }]}>
                        Description (Optional)
                      </ThemedText>
                      <TextInput
                        style={[
                          styles.input,
                          styles.textArea,
                          {
                            backgroundColor: background,
                            borderColor,
                            color: textColor,
                          },
                        ]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter project description..."
                        placeholderTextColor={textSecondary}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  )}
                  
                  <View style={styles.inputContainer}>
                    <ThemedText style={[styles.label, { color: textSecondary }]}>
                      Priority
                    </ThemedText>
                    <View style={styles.priorityContainer}>
                      {(['low', 'medium', 'high'] as const).map((priorityOption) => (
                        <TouchableOpacity
                          key={priorityOption}
                          onPress={() => setPriority(priorityOption)}
                          style={[
                            styles.priorityButton,
                            {
                              backgroundColor: priority === priorityOption 
                                ? PriorityColors[priorityOption].light[0] + '20'
                                : background,
                              borderColor: priority === priorityOption 
                                ? PriorityColors[priorityOption].light[0]
                                : borderColor,
                            },
                          ]}
                        >
                          <Ionicons
                            name={priorityOption === 'high' ? 'flame' : priorityOption === 'medium' ? 'warning' : 'leaf'}
                            size={16}
                            color={priority === priorityOption 
                              ? PriorityColors[priorityOption].light[0]
                              : textSecondary}
                          />
                          <ThemedText style={[
                            styles.priorityButtonText,
                            {
                              color: priority === priorityOption 
                                ? PriorityColors[priorityOption].light[0]
                                : textSecondary,
                              fontWeight: priority === priorityOption ? '600' : 'normal',
                            }
                          ]}>
                            {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                
                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={[styles.button, styles.cancelButton, { borderColor }]}
                  >
                    <ThemedText style={[styles.buttonText, { color: textSecondary }]}>
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!itemTitle.trim()}
                    style={[
                      styles.button,
                      {
                        opacity: itemTitle.trim() ? 1 : 0.5,
                      },
                    ]}
                  >
                    <GradientView style={styles.submitButton}>
                      <ThemedText style={[styles.buttonText, { color: 'white' }]}>
                        Add {type === 'project' ? 'Project' : 'Task'}
                      </ThemedText>
                    </GradientView>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  modalTitle: {
    fontSize: 24,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  submitButton: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10, // Reduced padding
    borderRadius: 8,
    borderWidth: 1,
    gap: 4, // Reduced gap
    minHeight: 40, // Add minimum height
  },
  priorityButtonText: {
    fontSize: 11, // Reduced font size
    textTransform: 'capitalize',
    flex: 1, // Allow text to wrap
    textAlign: 'center',
  },
});
