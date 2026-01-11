// Background service worker for Image Cropper extension

let popupWindowId = null;

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'cropImage',
        title: '使用圖片裁切工具編輯此圖片',
        contexts: ['image']
    });
});

// Open popup window
async function openPopupWindow() {
    // Check if window already exists
    if (popupWindowId !== null) {
        try {
            const existingWindow = await chrome.windows.get(popupWindowId);
            if (existingWindow) {
                chrome.windows.update(popupWindowId, { focused: true });
                return popupWindowId;
            }
        } catch (e) {
            popupWindowId = null;
        }
    }

    // Get current window to calculate position
    const currentWindow = await chrome.windows.getCurrent();
    const windowWidth = 270;
    const windowHeight = 400;

    // Position to upper right corner of current window
    const left = currentWindow.left + currentWindow.width - windowWidth - 20;
    const top = currentWindow.top + 80;

    // Create new window
    const window = await chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: windowWidth,
        height: windowHeight,
        left: Math.max(0, left),
        top: Math.max(0, top),
        focused: true
    });

    popupWindowId = window.id;
    return popupWindowId;
}

// Handle extension icon click
chrome.action.onClicked.addListener(async () => {
    await openPopupWindow();
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'cropImage' && info.srcUrl) {
        chrome.storage.local.set({ imageToLoad: info.srcUrl });
        await openPopupWindow();
    }
});

// Track window close
chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === popupWindowId) {
        popupWindowId = null;
    }
});
