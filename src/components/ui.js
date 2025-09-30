// State management
const widgetState = {
    chat: { visible: false },
    voice: { visible: false }
};

// Global container reference
let container;

// Create container for all components
function initAssistloreWidget() {
    container = document.createElement('div');
    container.id = 'assistlore-container';
    document.body.appendChild(container);

    // Add widget iframe (always visible)
    const widgetFrame = document.createElement('iframe');
    widgetFrame.src = 'http://localhost:3000/widget-UI/ui_sb81t6dhxysmg2ivewd/widget';
    widgetFrame.style.cssText = 'position: fixed; right: 80px; bottom: 20px; width: 350px; height: 110px; border: none; z-index: 9999; overflow: hidden;';
    widgetFrame.setAttribute('scrolling', 'no');
    widgetFrame.setAttribute('allow', 'microphone; camera; autoplay; encrypted-media');
    widgetFrame.onload = function() {
        try {
            const doc = widgetFrame.contentDocument || widgetFrame.contentWindow.document;
            const style = doc.createElement('style');
            style.innerHTML = `html, body, #__next { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; }`;
            doc.head.appendChild(style);
        } catch (e) {
            // Cross-origin if deployed, ignore
        }
    };
    container.appendChild(widgetFrame);

    // Add chat iframe (initially hidden)
    const chatFrame = document.createElement('iframe');
    chatFrame.id = 'assistlore-chat-frame';
    chatFrame.src = 'http://localhost:3000/widget-UI/ui_sb81t6dhxysmg2ivewd/chat';
    chatFrame.style.cssText = 'position: fixed; right: -25px; bottom: 20px; width: 400px; height: 600px; border: none; border-radius: 12px; background: transparent; overflow: hidden; display: none; z-index: 9999;';
    chatFrame.setAttribute('scrolling', 'no');
    chatFrame.setAttribute('allow', 'microphone; camera; autoplay; encrypted-media');
    container.appendChild(chatFrame);

    // Add voice iframe (initially hidden)
    const voiceFrame = document.createElement('iframe');
    voiceFrame.id = 'assistlore-voice-frame';
    voiceFrame.src = 'http://localhost:3000/widget-UI/ui_j0jjj2l47fme5g3n67/voice';
    voiceFrame.style.cssText = 'position: fixed; right: -25px; bottom: 20px; width: 400px; height: 600px; border: none; border-radius: 12px; background: transparent; overflow: hidden; display: none; z-index: 9999;';
    voiceFrame.setAttribute('scrolling', 'no');
    voiceFrame.setAttribute('allow', 'microphone; camera; autoplay; encrypted-media');
    container.appendChild(voiceFrame);

    // Handle messages from widget and chat/voice interfaces
    window.addEventListener('message', function(event) {
        console.log('Received message:', event.data); // Debug log
        
        if (event.data.source === 'assistlore-widget') {
            if (event.data.action === 'openChat') {
                toggleInterface('chat');
            } else if (event.data.action === 'openVoice') {
                toggleInterface('voice');
            }
        }
        // Handle close messages from chat/voice interfaces
        else if (event.data.source === 'assistlore-chat' && event.data.action === 'closeChat') {
            toggleInterface('chat');
        }
        else if (event.data.source === 'assistlore-voice' && event.data.action === 'closeVoice') {
            console.log('Closing voice interface', event.data); // Debug log
            const forceClose = event.data.force === true;
            toggleInterface('voice', forceClose);
        }
    });
}

function toggleInterface(type, forceClose = false) {
    console.log(`Toggle interface ${type}, force: ${forceClose}`); // Debug log
    const chatFrame = document.getElementById('assistlore-chat-frame');
    const voiceFrame = document.getElementById('assistlore-voice-frame');

    if (type === 'chat') {
        if (widgetState.chat.visible || forceClose) {
            console.log('Closing chat interface'); // Debug log
            chatFrame.style.display = 'none';
            widgetState.chat.visible = false;
        } else {
            chatFrame.style.display = 'block';
            voiceFrame.style.display = 'none'; // hide voice if open
            widgetState.chat.visible = true;
            widgetState.voice.visible = false;
        }
    } else if (type === 'voice') {
        if (widgetState.voice.visible || forceClose) {
            console.log('Closing voice interface'); // Debug log
            voiceFrame.style.display = 'none';
            widgetState.voice.visible = false;
            // Cleanup for voice
            try {
                voiceFrame.contentWindow?.postMessage({ action: 'cleanup' }, '*');
            } catch (e) {
                console.log('Cleanup message failed:', e);
            }
        } else {
            voiceFrame.style.display = 'block';
            chatFrame.style.display = 'none'; // hide chat if open
            widgetState.voice.visible = true;
            widgetState.chat.visible = false;
            // Start mic in chat assistant
            try {
                voiceFrame.contentWindow?.postMessage({ action: 'startMic' }, '*');
            } catch (e) {
                console.log('Start mic message failed:', e);
            }
        }
    }
}

// Initialize the widget when the page loads
document.addEventListener('DOMContentLoaded', initAssistloreWidget);
src/components/ui.js