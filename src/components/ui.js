// State management with persistence
const widgetState = JSON.parse(sessionStorage.getItem('assistlore_widget_state')) || {
    chat: { visible: false },
    voice: { visible: false }
};

// Global container reference
let container = document.getElementById('assistlore-container');

// Create container for all components
function initAssistloreWidget() {
    // Check if widget is already initialized
    if (container) return;

    // Save state before unload
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('assistlore_widget_state', JSON.stringify(widgetState));
    });
    container = document.createElement('div');
    container.id = 'assistlore-container';
    document.body.appendChild(container);

    // Add widget iframe (always visible)
    const widgetFrame = document.createElement('iframe');
    widgetFrame.src = 'http://localhost:3000/widget-UI/ui_j0jjj2l47fme5g3n67/widget';
    widgetFrame.style.cssText = 'position: fixed; right: 80px; bottom: 20px; width: 350px; height: 110px; border: none; z-index: 9999;';
    container.appendChild(widgetFrame);

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
    const frameId = `assistlore-${type}-frame`;
    let frame = document.getElementById(frameId);
    let wrapper = document.getElementById(`${frameId}-wrapper`);
    
    if (!frame) {
        // Create frame if it doesn't exist
        frame = document.createElement('iframe');
        frame.id = frameId;
        frame.src = `http://localhost:3000/widget-UI/ui_j0jjj2l47fme5g3n67/${type}`;
        frame.style.cssText = type === 'chat' 
            ? 'position: fixed; right: -15px; bottom: -12px; width: 520px; height: 650px; border: none; z-index: 9998;'
            : 'position: fixed; right: -15px; bottom: 20px; width: 350px; height: 260px; border: none; z-index: 9998;';
        
        wrapper = document.createElement('div');
        wrapper.id = `${frameId}-wrapper`;
        wrapper.className = 'interface-wrapper';
        wrapper.style.position = 'fixed';
        wrapper.style.right = type === 'chat' ? '-15px' : '-15px';
        wrapper.style.bottom = type === 'chat' ? '-12px' : '20px';
        wrapper.style.zIndex = '9999';
        wrapper.appendChild(frame);
        container.appendChild(wrapper);
    }
    
    if (widgetState[type].visible || forceClose) {
        console.log(`Closing ${type} interface`); // Debug log
        if (forceClose) {
            // Immediate removal for force close
            if (wrapper) wrapper.remove();
            widgetState[type].visible = false;
        } else {
            wrapper.classList.add('hidden');
            setTimeout(() => {
                if (wrapper && wrapper.parentNode) {
                    wrapper.remove();
                }
                // If it's the voice interface, make sure to clean up
                if (type === 'voice' && frame) {
                    try {
                        frame.contentWindow?.postMessage({ action: 'cleanup' }, '*');
                    } catch (e) {
                        console.log('Cleanup message failed:', e);
                    }
                }
            }, 300);
            widgetState[type].visible = false;
        }
    } else {
        wrapper.style.display = 'block';
        // Small delay to ensure display: block is processed before removing hidden
        setTimeout(() => {
            wrapper.classList.remove('hidden');
        }, 50);
        widgetState[type].visible = true;
    }
}

// Initialize the widget when the page loads
document.addEventListener('DOMContentLoaded', initAssistloreWidget);
