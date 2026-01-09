// Background service worker for Image Cropper extension

// Create context menu for right-clicking on images
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'cropImage',
        title: '使用圖片裁切工具編輯此圖片',
        contexts: ['image']
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cropImage' && info.srcUrl) {
        // Store the image URL for the popup to use
        chrome.storage.local.set({ imageToLoad: info.srcUrl }, () => {
            // Show notification to user
            chrome.action.setBadgeText({ text: '1' });
            chrome.action.setBadgeBackgroundColor({ color: '#4f46e5' });
        });
    }
});
