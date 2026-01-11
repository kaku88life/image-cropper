// Background service worker for Image Cropper extension

// Create context menu on install
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
        chrome.storage.local.set({ imageToLoad: info.srcUrl });
        chrome.action.setBadgeText({ text: '1' });
        chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
    }
});
