// Background service worker for Image Cropper extension

// Create context menu
function createContextMenu() {
    // Remove existing menu first to avoid duplicates
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'cropImage',
            title: '使用圖片裁切工具編輯此圖片',
            contexts: ['image']
        });
    });
}

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    createContextMenu();
});

// Also create on startup (in case it was lost)
chrome.runtime.onStartup.addListener(() => {
    createContextMenu();
});

// Create immediately when service worker loads
createContextMenu();

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cropImage' && info.srcUrl) {
        // Store the image URL for the popup to use
        chrome.storage.local.set({ imageToLoad: info.srcUrl }, () => {
            // Show badge notification
            chrome.action.setBadgeText({ text: '1' });
            chrome.action.setBadgeBackgroundColor({ color: '#4f46e5' });
        });
    }
});
