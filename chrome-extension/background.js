// Background service worker for Image Cropper extension

// Create context menu for right-clicking on images
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'cropImage',
        title: '使用圖片裁切工具裁切此圖片',
        contexts: ['image']
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cropImage') {
        // Store the image URL for the popup to use
        chrome.storage.local.set({ imageToLoad: info.srcUrl });
        // Open the popup
        chrome.action.openPopup();
    }
});
