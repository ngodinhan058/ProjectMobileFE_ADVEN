import ChatBoxItem from '../../components/ChatBoxItem';

const ChatAssistantScreen = ({ navigation, route }) => {
    const { title } = route.params
    return (
        <ChatBoxItem
            onBackPress={() => navigation.goBack()}
            headerTitle={title}
            onVoicePress={() => navigation.navigate('...')}
        />
    );
};
export default ChatAssistantScreen;