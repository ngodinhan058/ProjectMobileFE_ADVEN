import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const ModalComponent = ({ visible, onConfirm, onCancel }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>

                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 50 }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                                Bạn muốn thoát khỏi tài khoản hiện tại?
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                           
                            <TouchableOpacity style={styles.button} onPress={onCancel}>
                                <Text style={styles.buttonText}>Huỷ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonConfirm} onPress={onConfirm}>
                                <Text style={styles.buttonTextConfirm}>Đồng Ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>

    );
};


const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        height: height,
        width: width,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '75%',
    },
    buttonConfirm: {
        flex: 1,
        backgroundColor: '#6972F0',
        padding: 12,
        borderRadius: 100,
        justifyContent: 'center'
    },
    button: {
        flex: 0.5,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 100,
        marginHorizontal: 5,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#6972F0'

    },
    buttonTextConfirm: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    buttonText: {
        color: '#6972F0',
        textAlign: 'center',
        fontWeight: 'bold'
    },
});
export default ModalComponent;

