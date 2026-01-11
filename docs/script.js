// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const canvasContainer = document.getElementById('canvasContainer');
const canvasWrapper = document.getElementById('canvasWrapper');
const mainCanvas = document.getElementById('mainCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const resetAllBtn = document.getElementById('resetAllBtn');
const cropBox = document.getElementById('cropBox');
const cropSize = document.getElementById('cropSize');
const canvasInfo = document.getElementById('canvasInfo');
const removeImageBtn = document.getElementById('removeImageBtn');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const qualityControl = document.getElementById('qualityControl');
const completeBtn = document.getElementById('completeBtn');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const resultDownloadBtn = document.getElementById('resultDownloadBtn');
const resultCopyBtn = document.getElementById('resultCopyBtn');
const resultCloseBtn = document.getElementById('resultCloseBtn');
const floatingContainer = document.getElementById('floatingContainer');
const floatingBar = document.getElementById('floatingBar');
const drawToolbar = document.getElementById('drawToolbar');

// Tab elements
const tabHeader = document.getElementById('tabHeader');
const editTab = document.getElementById('editTab');
const resultTab = document.getElementById('resultTab');
const resultTabBtn = document.getElementById('resultTabBtn');

// Ratio dropdown elements
const ratioDropdownBtn = document.getElementById('ratioDropdownBtn');
const ratioDropdownMenu = document.getElementById('ratioDropdownMenu');
const currentRatioText = document.getElementById('currentRatioText');
const customWidth = document.getElementById('customWidth');
const customHeight = document.getElementById('customHeight');
const applyCustomRatio = document.getElementById('applyCustomRatio');
const lockRatioCheckbox = document.getElementById('lockRatio');

// Format dropdown elements
const formatDropdownBtn = document.getElementById('formatDropdownBtn');
const formatDropdownMenu = document.getElementById('formatDropdownMenu');
const currentFormatText = document.getElementById('currentFormatText');

// Draw tools elements
const drawTools = document.getElementById('drawTools');
const drawOptions = document.getElementById('drawOptions');
const colorPicker = document.getElementById('colorPicker');
const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPickerPopover = document.getElementById('colorPickerPopover');
const colorPreview = document.getElementById('colorPreview');
const colorHexInput = document.getElementById('colorHexInput');
const colorCodeDisplay = document.getElementById('colorCodeDisplay');
const hueSlider = document.getElementById('hueSlider');
const strokeWidth = document.getElementById('strokeWidth');
const strokePreview = document.getElementById('strokePreview');
const textSizeSelect = document.getElementById('textSizeSelect');
const textSizeInput = document.getElementById('textSizeInput');

// Tool dropdown elements
const penDropdown = document.getElementById('penDropdown');
const penDropdownBtn = document.getElementById('penDropdownBtn');
const penMenu = document.getElementById('penMenu');
const penIcon = document.getElementById('penIcon');
const shapeDropdown = document.getElementById('shapeDropdown');
const shapeDropdownBtn = document.getElementById('shapeDropdownBtn');
const shapeMenu = document.getElementById('shapeMenu');
const shapeIcon = document.getElementById('shapeIcon');

// Current color state
let currentColor = '#ff0000';
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearDrawBtn = document.getElementById('clearDrawBtn');

// Text input elements
const textInputContainer = document.getElementById('textInputContainer');
const textInput = document.getElementById('textInput');
const textConfirm = document.getElementById('textConfirm');
const textCancel = document.getElementById('textCancel');

// Contexts
let mainCtx = null;
let drawCtx = null;

// State
let image = null;
let scale = 1;
let currentMode = 'crop';
let currentShape = 'rect';
let currentRatio = 16 / 10;
let currentFormat = 'png';

// Target output dimensions
let targetDimensions = { width: 1280, height: 800 };
let imageOffset = { x: 0, y: 0 };

// Crop state
let cropState = { x: 0, y: 0, width: 0, height: 0 };
let isDragging = false;
let isResizing = false;
let activeHandle = null;
let dragStart = { x: 0, y: 0 };
let cropStart = { x: 0, y: 0, width: 0, height: 0 };

// Draw state
let isDrawing = false;
let drawStart = { x: 0, y: 0 };
let drawHistory = [];
let redoHistory = [];
let currentDrawing = null;
let penPoints = [];
let textPosition = { x: 0, y: 0 };
let currentResultCanvas = null;
let currentResultBlob = null;
let fillEnabled = false;

// Fill toggle button
const fillToggleBtn = document.getElementById('fillToggleBtn');

// Initialize
function init() {
    mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
    drawCtx = drawCanvas.getContext('2d', { willReadFrequently: true });
    setupEventListeners();
}

function setupEventListeners() {
    // Upload events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    document.addEventListener('paste', handlePaste);

    // Tab switching
    tabHeader.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn') && !e.target.disabled) {
            switchTab(e.target.dataset.tab);
        }
    });

    // Mode selection
    document.querySelectorAll('[data-tool]').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.tool));
    });

    // Shape selection (both tool-btn and tool-option)
    document.querySelectorAll('[data-shape]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setShape(btn.dataset.shape);
        });
    });

    // Fill toggle button
    if (fillToggleBtn) {
        fillToggleBtn.addEventListener('click', () => {
            fillEnabled = !fillEnabled;
            fillToggleBtn.classList.toggle('active', fillEnabled);
        });
    }

    // Tool dropdown buttons
    if (penDropdownBtn) {
        penDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            penMenu.classList.toggle('visible');
            shapeMenu?.classList.remove('visible');
        });
    }
    if (shapeDropdownBtn) {
        shapeDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shapeMenu.classList.toggle('visible');
            penMenu?.classList.remove('visible');
        });
    }

    // Ratio dropdown
    ratioDropdownBtn.addEventListener('click', toggleRatioDropdown);
    document.querySelectorAll('.ratio-option').forEach(option => {
        option.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-ratio-inputs')) {
                selectRatio(option);
            }
        });
    });
    applyCustomRatio.addEventListener('click', applyCustomRatioValue);

    // Format dropdown
    formatDropdownBtn.addEventListener('click', toggleFormatDropdown);
    document.querySelectorAll('.format-option').forEach(option => {
        option.addEventListener('click', () => selectFormat(option));
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ratio-dropdown-wrapper')) {
            ratioDropdownMenu.classList.remove('visible');
            ratioDropdownBtn.classList.remove('active');
        }
        if (!e.target.closest('.format-dropdown-wrapper')) {
            formatDropdownMenu.classList.remove('visible');
            formatDropdownBtn.classList.remove('active');
        }
        // Close tool dropdowns
        if (!e.target.closest('.tool-dropdown')) {
            penMenu?.classList.remove('visible');
            shapeMenu?.classList.remove('visible');
        }
    });

    // Quality slider
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
    });

    // Crop box events
    cropBox.addEventListener('mousedown', handleCropMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Touch events
    cropBox.addEventListener('touchstart', handleCropTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    // Draw canvas events
    drawCanvas.addEventListener('mousedown', handleDrawMouseDown);
    drawCanvas.addEventListener('touchstart', handleDrawTouchStart);

    // Draw options - Color picker
    colorPickerBtn.addEventListener('click', toggleColorPicker);
    colorPicker.addEventListener('input', handleColorPickerChange);
    colorHexInput.addEventListener('input', handleHexInputChange);
    colorHexInput.addEventListener('blur', handleHexInputBlur);
    hueSlider.addEventListener('input', handleHueSliderChange);
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => selectColorSwatch(swatch));
    });

    // Close color picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.color-picker-wrapper')) {
            colorPickerPopover.classList.remove('visible');
        }
    });

    // Draw options - Stroke width
    strokeWidth.addEventListener('input', updateStrokePreview);
    updateStrokePreview();
    updateColorPreview('#ff0000');

    // Action buttons
    undoBtn.addEventListener('click', undoLastDraw);
    redoBtn.addEventListener('click', redoLastDraw);
    clearDrawBtn.addEventListener('click', clearAllDrawings);
    removeImageBtn.addEventListener('click', resetToUpload);
    resetAllBtn.addEventListener('click', resetAllSettings);

    // Text input
    textConfirm.addEventListener('click', confirmText);
    textCancel.addEventListener('click', cancelText);

    // Text size sync
    if (textSizeSelect) {
        textSizeSelect.addEventListener('change', () => {
            if (textSizeInput) textSizeInput.value = textSizeSelect.value;
        });
    }
    if (textSizeInput) {
        textSizeInput.addEventListener('input', () => {
            const val = parseInt(textSizeInput.value) || 36;
            // Update select if matching option exists
            const option = textSizeSelect?.querySelector(`option[value="${val}"]`);
            if (option) {
                textSizeSelect.value = val;
            }
        });
    }

    // Export events
    completeBtn.addEventListener('click', showResult);
    downloadBtn.addEventListener('click', downloadImage);
    copyBtn.addEventListener('click', copyImageToClipboard);

    // Result page download/copy buttons
    if (resultDownloadBtn) resultDownloadBtn.addEventListener('click', downloadResultImage);
    if (resultCopyBtn) resultCopyBtn.addEventListener('click', copyResultImageToClipboard);
    if (resultCloseBtn) resultCloseBtn.addEventListener('click', closeResult);

    // Canvas drag-drop for replacing image
    canvasContainer.addEventListener('dragover', handleCanvasDragOver);
    canvasContainer.addEventListener('dragleave', handleCanvasDragLeave);
    canvasContainer.addEventListener('drop', handleCanvasDrop);

    // Result image drag events
    resultImage.addEventListener('dragstart', handleResultDragStart);
    resultImage.addEventListener('dragend', handleResultDragEnd);
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    editTab.classList.toggle('active', tabName === 'edit');
    resultTab.classList.toggle('active', tabName === 'result');
}

// Close result and go back to edit
function closeResult() {
    switchTab('edit');
    resultImage.src = '';
    currentResultCanvas = null;
    currentResultBlob = null;
}

// File handling
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) loadImage(file);
}

function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) loadImage(file);
            break;
        }
    }
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const tempImage = new Image();
        tempImage.onload = () => {
            ensureMinimumSize(tempImage, 1280, 800, (finalImage) => {
                image = finalImage;
                showEditor();
                setupCanvas();
            });
        };
        tempImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function ensureMinimumSize(sourceImage, minWidth, minHeight, callback) {
    const imgWidth = sourceImage.width;
    const imgHeight = sourceImage.height;
    const scaleX = minWidth / imgWidth;
    const scaleY = minHeight / imgHeight;
    const requiredScale = Math.max(scaleX, scaleY);

    if (requiredScale <= 1) {
        callback(sourceImage);
        return;
    }

    const newWidth = Math.ceil(imgWidth * requiredScale);
    const newHeight = Math.ceil(imgHeight * requiredScale);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(sourceImage, 0, 0, newWidth, newHeight);

    const scaledImage = new Image();
    scaledImage.onload = () => {
        callback(scaledImage);
    };
    scaledImage.src = tempCanvas.toDataURL('image/png');
}

function showEditor() {
    uploadArea.classList.add('hidden');
    canvasContainer.classList.add('visible');
    canvasContainer.classList.add('crop-mode');
    canvasInfo.classList.add('visible');
    completeBtn.disabled = false;
    floatingContainer.classList.add('visible');
    resultTabBtn.disabled = true;
    switchTab('edit');
}

function resetToUpload() {
    image = null;
    uploadArea.classList.remove('hidden');
    canvasContainer.classList.remove('visible');
    canvasContainer.classList.remove('crop-mode');
    canvasContainer.classList.remove('draw-mode');
    canvasInfo.classList.remove('visible');
    completeBtn.disabled = true;
    floatingContainer.classList.remove('visible');
    floatingContainer.classList.remove('draw-mode');
    resultTabBtn.disabled = true;
    currentResultCanvas = null;
    currentResultBlob = null;
    fileInput.value = '';
    drawHistory = [];
    redoHistory = [];
    switchTab('edit');

    setMode('crop');

    document.querySelectorAll('.ratio-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.ratio === '16:10') opt.classList.add('active');
    });
    currentRatioText.textContent = '1280×800';
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };
}

function resetAllSettings() {
    if (resetAllBtn) {
        resetAllBtn.style.transform = 'rotate(360deg)';
        resetAllBtn.style.transition = 'transform 0.3s';
        setTimeout(() => {
            resetAllBtn.style.transform = '';
        }, 300);
    }

    // Reset ratio
    document.querySelectorAll('.ratio-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.ratio === '16:10') opt.classList.add('active');
    });
    currentRatioText.textContent = '1280×800';
    currentRatio = 16 / 10;
    targetDimensions = { width: 1280, height: 800 };

    // Reset format
    document.querySelectorAll('.format-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.format === 'png');
    });
    currentFormatText.textContent = 'PNG';
    currentFormat = 'png';
    qualityControl.classList.remove('visible');

    // Reset mode
    setMode('crop');

    // Clear drawings
    drawHistory = [];
    redoHistory = [];
    clearDrawCanvas();
    updateUndoRedoButtons();

    // Reset drawing tools
    colorPicker.value = '#ff0000';
    colorHexInput.value = '#FF0000';
    hueSlider.value = 0;
    strokeWidth.value = 3;
    fillEnabled = false;
    if (fillToggleBtn) fillToggleBtn.classList.remove('active');
    updateColorPreview('#ff0000');
    updateStrokePreview();

    // Reset crop box
    if (image) {
        initCropBox();
        mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
    }

    // Reset to edit tab
    resultTabBtn.disabled = true;
    currentResultCanvas = null;
    currentResultBlob = null;
    switchTab('edit');

    // Reset quality
    qualitySlider.value = 90;
    qualityValue.textContent = '90%';
}

function setupCanvas() {
    const containerWidth = canvasContainer.clientWidth || 800;
    const containerHeight = 500;

    const scaleX = containerWidth / image.width;
    const scaleY = containerHeight / image.height;
    scale = Math.min(scaleX, scaleY, 1);

    const displayWidth = image.width * scale;
    const displayHeight = image.height * scale;

    mainCanvas.width = displayWidth;
    mainCanvas.height = displayHeight;
    drawCanvas.width = displayWidth;
    drawCanvas.height = displayHeight;

    drawCanvas.style.width = displayWidth + 'px';
    drawCanvas.style.height = displayHeight + 'px';

    canvasWrapper.style.width = displayWidth + 'px';
    canvasWrapper.style.height = displayHeight + 'px';

    imageOffset.x = (containerWidth - displayWidth) / 2;
    imageOffset.y = 0;

    mainCtx.drawImage(image, 0, 0, displayWidth, displayHeight);

    initCropBox();
    clearDrawCanvas();
}

function initCropBox() {
    const padding = 40;
    cropState.x = padding;
    cropState.y = padding;
    cropState.width = mainCanvas.width - padding * 2;
    cropState.height = mainCanvas.height - padding * 2;

    if (currentRatio) applyCropRatio();
    updateCropBox();
}

// Mode handling
function setMode(mode) {
    currentMode = mode;

    document.querySelectorAll('[data-tool]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === mode);
    });

    canvasContainer.classList.toggle('crop-mode', mode === 'crop');
    canvasContainer.classList.toggle('draw-mode', mode === 'draw');
    floatingContainer.classList.toggle('draw-mode', mode === 'draw');

    if (mode === 'draw' && !document.querySelector('[data-shape].active')) {
        setShape('pen');
    }
}

function setShape(shape) {
    currentShape = shape;

    const penShapes = ['pen', 'marker', 'highlighter', 'eraser'];
    const geometryShapes = ['rect', 'circle', 'arrow', 'line'];

    // Update active states
    document.querySelectorAll('.tool-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shape === shape);
    });
    document.querySelectorAll('.tool-btn[data-shape]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shape === shape);
    });

    // Update dropdown button states
    if (penDropdownBtn) {
        penDropdownBtn.classList.toggle('active', penShapes.includes(shape));
    }
    if (shapeDropdownBtn) {
        shapeDropdownBtn.classList.toggle('active', geometryShapes.includes(shape));
    }

    // Update dropdown icons based on selected shape
    if (penShapes.includes(shape) && penIcon) {
        const selectedOption = penMenu?.querySelector(`[data-shape="${shape}"] svg`);
        if (selectedOption) {
            penIcon.innerHTML = selectedOption.outerHTML;
        }
    }
    if (geometryShapes.includes(shape) && shapeIcon) {
        const selectedOption = shapeMenu?.querySelector(`[data-shape="${shape}"] svg`);
        if (selectedOption) {
            shapeIcon.innerHTML = selectedOption.outerHTML;
        }
    }

    // Close dropdown menus
    penMenu?.classList.remove('visible');
    shapeMenu?.classList.remove('visible');
}

// Color picker functions
function toggleColorPicker(e) {
    e.stopPropagation();
    colorPickerPopover.classList.toggle('visible');
}

function handleColorPickerChange() {
    const color = colorPicker.value;
    updateColorPreview(color);
    colorHexInput.value = color.toUpperCase();
    updateSwatchSelection(color);
}

function handleHexInputChange() {
    let hex = colorHexInput.value;
    if (!hex.startsWith('#')) {
        hex = '#' + hex;
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        colorPicker.value = hex;
        updateColorPreview(hex);
        updateSwatchSelection(hex);
    }
}

function handleHexInputBlur() {
    colorHexInput.value = colorPicker.value.toUpperCase();
}

function selectColorSwatch(swatch) {
    const color = swatch.dataset.color;
    colorPicker.value = color;
    colorHexInput.value = color.toUpperCase();
    updateColorPreview(color);
    updateSwatchSelection(color);
    colorPickerPopover.classList.remove('visible');
}

function updateColorPreview(color) {
    colorPreview.style.background = color;
    // Update color code display
    if (colorCodeDisplay) {
        colorCodeDisplay.textContent = color.toUpperCase();
    }
    // Also update stroke preview color
    const strokeDot = strokePreview.querySelector('.stroke-dot');
    if (strokeDot) {
        strokeDot.style.background = color;
    }
}

function updateSwatchSelection(color) {
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.color.toLowerCase() === color.toLowerCase());
    });
}

// Hue slider handler
function handleHueSliderChange() {
    const hue = parseInt(hueSlider.value);
    const color = hslToHex(hue, 100, 50);
    colorPicker.value = color;
    colorHexInput.value = color.toUpperCase();
    updateColorPreview(color);
    updateSwatchSelection(color);
}

// Convert HSL to HEX
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function updateStrokePreview() {
    const size = Math.min(Math.max(parseInt(strokeWidth.value), 1), 28);
    const strokeDot = strokePreview.querySelector('.stroke-dot');
    if (strokeDot) {
        strokeDot.style.width = size + 'px';
        strokeDot.style.height = size + 'px';
        strokeDot.style.background = colorPicker.value;
    }
}

// Ratio dropdown
function toggleRatioDropdown(e) {
    e.stopPropagation();
    ratioDropdownMenu.classList.toggle('visible');
    ratioDropdownBtn.classList.toggle('active');
    formatDropdownMenu.classList.remove('visible');
    formatDropdownBtn.classList.remove('active');
}

const ratioDimensions = {
    '16:10': { width: 1280, height: 800 },
    '16:9': { width: 1920, height: 1080 },
    '4:3': { width: 1600, height: 1200 },
    '1:1': { width: 1080, height: 1080 },
    '3:2': { width: 1800, height: 1200 },
    '2:3': { width: 1200, height: 1800 },
    '9:16': { width: 1080, height: 1920 }
};

function selectRatio(option) {
    const ratio = option.dataset.ratio;
    if (ratio === 'custom') return;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    if (ratio === 'free') {
        currentRatio = null;
        targetDimensions = null;
        currentRatioText.textContent = '自由';
    } else {
        const [w, h] = ratio.split(':').map(Number);
        currentRatio = w / h;
        targetDimensions = ratioDimensions[ratio] || { width: w * 100, height: h * 100 };
        currentRatioText.textContent = `${targetDimensions.width}×${targetDimensions.height}`;
    }

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

function applyCustomRatioValue(e) {
    e.stopPropagation();
    const w = parseInt(customWidth.value) || 800;
    const h = parseInt(customHeight.value) || 600;

    targetDimensions = { width: w, height: h };
    currentRatio = w / h;

    document.querySelectorAll('.ratio-option').forEach(opt => opt.classList.remove('active'));
    document.querySelector('.custom-ratio-option').classList.add('active');

    currentRatioText.textContent = `${w}×${h}`;

    if (image) {
        applyCropRatio();
        updateCropBox();
    }

    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

// Format dropdown
function toggleFormatDropdown(e) {
    e.stopPropagation();
    formatDropdownMenu.classList.toggle('visible');
    formatDropdownBtn.classList.toggle('active');
    ratioDropdownMenu.classList.remove('visible');
    ratioDropdownBtn.classList.remove('active');
}

function selectFormat(option) {
    const format = option.dataset.format;
    currentFormat = format;

    document.querySelectorAll('.format-option').forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');

    currentFormatText.textContent = format.toUpperCase();

    // Show/hide quality control
    if (format === 'png') {
        qualityControl.classList.remove('visible');
    } else {
        qualityControl.classList.add('visible');
    }

    formatDropdownMenu.classList.remove('visible');
    formatDropdownBtn.classList.remove('active');
}

function applyCropRatio() {
    if (!currentRatio) return;

    const canvasRatio = mainCanvas.width / mainCanvas.height;
    const centerX = cropState.x + cropState.width / 2;
    const centerY = cropState.y + cropState.height / 2;

    let newWidth, newHeight;

    if (currentRatio > canvasRatio) {
        newWidth = Math.min(cropState.width, mainCanvas.width - 20);
        newHeight = newWidth / currentRatio;
    } else {
        newHeight = Math.min(cropState.height, mainCanvas.height - 20);
        newWidth = newHeight * currentRatio;
    }

    cropState.width = newWidth;
    cropState.height = newHeight;
    cropState.x = centerX - newWidth / 2;
    cropState.y = centerY - newHeight / 2;

    constrainCropBox();
}

// Crop box manipulation
function updateCropBox() {
    cropBox.style.left = `${cropState.x}px`;
    cropBox.style.top = `${cropState.y}px`;
    cropBox.style.width = `${cropState.width}px`;
    cropBox.style.height = `${cropState.height}px`;

    if (targetDimensions) {
        cropSize.textContent = `${targetDimensions.width} × ${targetDimensions.height}`;
    } else {
        const actualWidth = Math.round(cropState.width / scale);
        const actualHeight = Math.round(cropState.height / scale);
        cropSize.textContent = `${actualWidth} × ${actualHeight}`;
    }
}

function constrainCropBox() {
    cropState.width = Math.max(30, Math.min(cropState.width, mainCanvas.width));
    cropState.height = Math.max(30, Math.min(cropState.height, mainCanvas.height));
    cropState.x = Math.max(0, Math.min(cropState.x, mainCanvas.width - cropState.width));
    cropState.y = Math.max(0, Math.min(cropState.y, mainCanvas.height - cropState.height));
}

// Crop mouse events
function handleCropMouseDown(e) {
    if (currentMode !== 'crop') return;
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains('crop-handle')) {
        isResizing = true;
        activeHandle = target.dataset.handle;
    } else {
        isDragging = true;
    }

    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    cropStart = { ...cropState };
}

function handleCropTouchStart(e) {
    if (currentMode !== 'crop') return;
    const touch = e.touches[0];
    handleCropMouseDown({
        preventDefault: () => {},
        target: e.target,
        clientX: touch.clientX,
        clientY: touch.clientY
    });
}

// Draw mouse events
function handleDrawMouseDown(e) {
    if (currentMode !== 'draw') return;
    e.preventDefault();

    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentShape === 'text') {
        showTextInput(x, y);
        return;
    }

    drawStart.x = x;
    drawStart.y = y;
    isDrawing = true;
    penPoints = [{ x, y }];

    redoHistory = [];
    updateUndoRedoButtons();
}

function handleDrawTouchStart(e) {
    if (currentMode !== 'draw') return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (currentShape === 'text') {
        showTextInput(x, y);
        return;
    }

    drawStart.x = x;
    drawStart.y = y;
    isDrawing = true;
    penPoints = [{ x, y }];

    redoHistory = [];
    updateUndoRedoButtons();
}

// Unified mouse move
function handleMouseMove(e) {
    if (currentMode === 'crop' && (isDragging || isResizing)) {
        handleCropMove(e.clientX, e.clientY);
    } else if (currentMode === 'draw' && isDrawing) {
        const rect = drawCanvas.getBoundingClientRect();
        handleDrawMove(e.clientX - rect.left, e.clientY - rect.top);
    }
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    if (currentMode === 'crop' && (isDragging || isResizing)) {
        e.preventDefault();
        handleCropMove(touch.clientX, touch.clientY);
    } else if (currentMode === 'draw' && isDrawing) {
        e.preventDefault();
        const rect = drawCanvas.getBoundingClientRect();
        handleDrawMove(touch.clientX - rect.left, touch.clientY - rect.top);
    }
}

function handleCropMove(clientX, clientY) {
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;

    if (isDragging) {
        cropState.x = cropStart.x + dx;
        cropState.y = cropStart.y + dy;
        constrainCropBox();
    } else if (isResizing) {
        resizeCropBox(dx, dy);
    }

    updateCropBox();
}

function handleDrawMove(x, y) {
    const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser', 'mosaic', 'blur'];
    if (brushTypes.includes(currentShape)) {
        penPoints.push({ x, y });
    }

    clearDrawCanvas();
    redrawHistory();

    const color = colorPicker.value;
    const lineWidth = parseInt(strokeWidth.value);

    if (brushTypes.includes(currentShape)) {
        if (currentShape === 'mosaic') {
            drawMosaicBrushDisplay(drawCtx, penPoints, lineWidth);
        } else if (currentShape === 'blur') {
            drawBlurBrushDisplay(drawCtx, penPoints, lineWidth);
        } else {
            drawPenStroke(drawCtx, penPoints, color, lineWidth, currentShape);
        }
    } else {
        drawShape(drawCtx, currentShape, drawStart.x, drawStart.y, x, y, color, lineWidth, fillEnabled);
    }
}

// Mouse up
function handleMouseUp(e) {
    if (currentMode === 'crop') {
        isDragging = false;
        isResizing = false;
        activeHandle = null;
    } else if (currentMode === 'draw' && isDrawing) {
        const rect = drawCanvas.getBoundingClientRect();
        finalizeDrawing(e.clientX - rect.left, e.clientY - rect.top);
    }
}

function handleTouchEnd(e) {
    if (currentMode === 'crop') {
        isDragging = false;
        isResizing = false;
        activeHandle = null;
    } else if (currentMode === 'draw' && isDrawing) {
        const lastPoint = penPoints.length > 0 ? penPoints[penPoints.length - 1] : drawStart;
        finalizeDrawing(lastPoint.x, lastPoint.y);
    }
}

function finalizeDrawing(endX, endY) {
    if (!isDrawing) return;
    isDrawing = false;

    const color = colorPicker.value;
    const lineWidth = parseInt(strokeWidth.value);
    const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser', 'mosaic', 'blur'];

    if (brushTypes.includes(currentShape)) {
        drawHistory.push({
            shape: currentShape,
            points: [...penPoints],
            color,
            lineWidth,
            penType: currentShape
        });
    } else {
        drawHistory.push({
            shape: currentShape,
            x1: drawStart.x,
            y1: drawStart.y,
            x2: endX,
            y2: endY,
            color,
            lineWidth,
            fill: fillEnabled
        });
    }

    clearDrawCanvas();
    redrawHistory();

    penPoints = [];
    updateUndoRedoButtons();
}

// Crop resize
function resizeCropBox(dx, dy) {
    const minSize = 30;
    let newX = cropStart.x;
    let newY = cropStart.y;
    let newWidth = cropStart.width;
    let newHeight = cropStart.height;

    // Check if ratio should be locked
    const shouldLockRatio = lockRatioCheckbox && lockRatioCheckbox.checked && currentRatio;

    switch (activeHandle) {
        case 'nw':
            newX = cropStart.x + dx;
            newY = cropStart.y + dy;
            newWidth = cropStart.width - dx;
            newHeight = cropStart.height - dy;
            break;
        case 'n':
            newY = cropStart.y + dy;
            newHeight = cropStart.height - dy;
            break;
        case 'ne':
            newY = cropStart.y + dy;
            newWidth = cropStart.width + dx;
            newHeight = cropStart.height - dy;
            break;
        case 'w':
            newX = cropStart.x + dx;
            newWidth = cropStart.width - dx;
            break;
        case 'e':
            newWidth = cropStart.width + dx;
            break;
        case 'sw':
            newX = cropStart.x + dx;
            newWidth = cropStart.width - dx;
            newHeight = cropStart.height + dy;
            break;
        case 's':
            newHeight = cropStart.height + dy;
            break;
        case 'se':
            newWidth = cropStart.width + dx;
            newHeight = cropStart.height + dy;
            break;
    }

    newWidth = Math.max(minSize, newWidth);
    newHeight = Math.max(minSize, newHeight);

    // 如果鎖定比例，根據拖動的方向調整尺寸
    if (shouldLockRatio) {
        const aspectRatio = currentRatio;

        // 根據拖動方向決定以哪個軸為主
        if (['n', 's'].includes(activeHandle)) {
            // 上下拖動，以高度為主
            newWidth = newHeight * aspectRatio;
        } else if (['e', 'w'].includes(activeHandle)) {
            // 左右拖動，以寬度為主
            newHeight = newWidth / aspectRatio;
        } else {
            // 角落拖動，取較大的變化
            const widthFromHeight = newHeight * aspectRatio;
            const heightFromWidth = newWidth / aspectRatio;

            if (Math.abs(dx) > Math.abs(dy)) {
                newHeight = heightFromWidth;
            } else {
                newWidth = widthFromHeight;
            }
        }

        // 調整位置以保持對角固定
        if (['nw', 'n', 'ne'].includes(activeHandle)) {
            newY = cropStart.y + cropStart.height - newHeight;
        }
        if (['nw', 'w', 'sw'].includes(activeHandle)) {
            newX = cropStart.x + cropStart.width - newWidth;
        }
    }

    // 確保不超出畫布邊界
    if (newX < 0) {
        if (shouldLockRatio) {
            const overflow = -newX;
            newX = 0;
            newWidth -= overflow;
            newHeight = newWidth / currentRatio;
        } else {
            newWidth += newX;
            newX = 0;
        }
    }
    if (newY < 0) {
        if (shouldLockRatio) {
            const overflow = -newY;
            newY = 0;
            newHeight -= overflow;
            newWidth = newHeight * currentRatio;
        } else {
            newHeight += newY;
            newY = 0;
        }
    }
    if (newX + newWidth > mainCanvas.width) {
        if (shouldLockRatio) {
            newWidth = mainCanvas.width - newX;
            newHeight = newWidth / currentRatio;
        } else {
            newWidth = mainCanvas.width - newX;
        }
    }
    if (newY + newHeight > mainCanvas.height) {
        if (shouldLockRatio) {
            newHeight = mainCanvas.height - newY;
            newWidth = newHeight * currentRatio;
        } else {
            newHeight = mainCanvas.height - newY;
        }
    }

    if (newWidth >= minSize) {
        cropState.x = newX;
        cropState.width = newWidth;
    }
    if (newHeight >= minSize) {
        cropState.y = newY;
        cropState.height = newHeight;
    }
}

// Text input handling
function showTextInput(x, y) {
    textPosition = { x, y };
    textInputContainer.style.left = `${x}px`;
    textInputContainer.style.top = `${y}px`;
    textInputContainer.classList.add('visible');
    textInput.value = '';
    textInput.focus();
}

function confirmText() {
    const text = textInput.value.trim();
    if (text) {
        const color = colorPicker.value;
        const fontSize = parseInt(textSizeInput?.value || textSizeSelect?.value || 36);

        drawHistory.push({
            shape: 'text',
            text,
            x: textPosition.x,
            y: textPosition.y,
            color,
            fontSize
        });

        clearDrawCanvas();
        redrawHistory();
        updateUndoRedoButtons();
    }
    cancelText();
}

function cancelText() {
    textInputContainer.classList.remove('visible');
    textInput.value = '';
}

// Drawing functions
function clearDrawCanvas() {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}

function redrawHistory() {
    const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser'];
    for (const item of drawHistory) {
        if (item.shape === 'fillBucket') {
            // Restore fill bucket image data
            if (item.imageData) {
                drawCtx.putImageData(item.imageData, 0, 0);
            }
        } else if (brushTypes.includes(item.shape)) {
            drawPenStroke(drawCtx, item.points, item.color, item.lineWidth, item.penType || item.shape);
        } else if (item.shape === 'mosaic') {
            applyMosaicBrush(drawCtx, item.points, item.lineWidth);
        } else if (item.shape === 'blur') {
            applyBlurBrush(drawCtx, item.points, item.lineWidth);
        } else if (item.shape === 'text') {
            drawText(drawCtx, item.text, item.x, item.y, item.color, item.fontSize);
        } else {
            drawShape(drawCtx, item.shape, item.x1, item.y1, item.x2, item.y2, item.color, item.lineWidth, item.fill);
        }
    }
}

function drawPenStroke(ctx, points, color, lineWidth, penType) {
    if (points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Handle legacy isHighlighter boolean
    if (penType === true) penType = 'highlighter';
    if (penType === false) penType = 'pen';

    switch (penType) {
        case 'highlighter':
            ctx.lineWidth = lineWidth * 3;
            ctx.globalAlpha = 0.4;
            break;
        case 'marker':
            ctx.lineWidth = lineWidth * 1.5;
            ctx.globalAlpha = 0.85;
            break;
        case 'watercolor':
            ctx.lineWidth = lineWidth * 2;
            ctx.globalAlpha = 0.3;
            break;
        case 'crayon':
            ctx.lineWidth = lineWidth * 1.8;
            ctx.globalAlpha = 0.7;
            // Add texture effect for crayon
            ctx.shadowColor = color;
            ctx.shadowBlur = 1;
            break;
        case 'eraser':
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = lineWidth * 2;
            ctx.globalAlpha = 1;
            break;
        default: // pen
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = 0.9;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
    ctx.restore();
}

function drawText(ctx, text, x, y, color, fontSize) {
    ctx.save();
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    const lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, x, y + index * fontSize * 1.2);
    });
    ctx.restore();
}

function drawShape(ctx, shape, x1, y1, x2, y2, color, lineWidth, fill, sourceCtx = null) {
    if (shape === 'blur' || shape === 'mosaic') {
        console.log('drawShape:', shape, 'x1:', x1, 'y1:', y1, 'x2:', x2, 'y2:', y2, 'hasSourceCtx:', !!sourceCtx);
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    const width = maxX - minX;
    const height = maxY - minY;

    if (shape === 'blur' || shape === 'mosaic') {
        console.log('drawShape calculated:', 'minX:', minX, 'minY:', minY, 'width:', width, 'height:', height);
    }

    switch (shape) {
        case 'rect':
            if (fill) {
                ctx.fillRect(minX, minY, width, height);
            } else {
                ctx.strokeRect(minX, minY, width, height);
            }
            break;

        case 'circle':
            const centerX = minX + width / 2;
            const centerY = minY + height / 2;
            const radiusX = width / 2;
            const radiusY = height / 2;
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            if (fill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            break;

        case 'line':
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            break;

        case 'arrow':
            drawArrow(ctx, x1, y1, x2, y2, lineWidth);
            break;

        case 'mosaic':
            applyMosaic(ctx, minX, minY, width, height, sourceCtx);
            break;

        case 'blur':
            applyBlur(ctx, minX, minY, width, height, sourceCtx);
            break;
    }
}

function drawArrow(ctx, x1, y1, x2, y2, lineWidth) {
    const headLength = Math.max(lineWidth * 3, 15);
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function applyMosaic(ctx, x, y, width, height, sourceCtx = null) {
    console.log('applyMosaic called:', { x, y, width, height, hasSourceCtx: !!sourceCtx });

    if (width < 5 || height < 5) {
        console.log('applyMosaic: early return - size too small');
        return;
    }

    const source = sourceCtx || mainCtx;
    const sourceCanvas = source.canvas;

    console.log('applyMosaic: sourceCanvas dimensions:', sourceCanvas.width, 'x', sourceCanvas.height);

    // Calculate the visible portion within canvas bounds
    const startX = Math.floor(x);
    const startY = Math.floor(y);
    const endX = Math.floor(x + width);
    const endY = Math.floor(y + height);

    // Clip to canvas bounds
    const canvasX = Math.max(0, startX);
    const canvasY = Math.max(0, startY);
    const canvasEndX = Math.min(sourceCanvas.width, endX);
    const canvasEndY = Math.min(sourceCanvas.height, endY);

    const canvasW = canvasEndX - canvasX;
    const canvasH = canvasEndY - canvasY;

    console.log('applyMosaic: clipped region:', { canvasX, canvasY, canvasEndX, canvasEndY, canvasW, canvasH });

    if (canvasW <= 0 || canvasH <= 0) {
        console.log('applyMosaic: early return - clipped size is zero or negative');
        return;
    }

    const blockSize = 10;
    console.log('applyMosaic: about to getImageData');
    const imageData = source.getImageData(canvasX, canvasY, canvasW, canvasH);
    console.log('applyMosaic: got imageData, size:', imageData.data.length);
    const data = imageData.data;

    for (let py = 0; py < canvasH; py += blockSize) {
        for (let px = 0; px < canvasW; px += blockSize) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = 0; dy < blockSize && py + dy < canvasH; dy++) {
                for (let dx = 0; dx < blockSize && px + dx < canvasW; dx++) {
                    const i = ((py + dy) * canvasW + (px + dx)) * 4;
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    count++;
                }
            }

            if (count > 0) {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(canvasX + px, canvasY + py,
                    Math.min(blockSize, canvasW - px),
                    Math.min(blockSize, canvasH - py));
            }
        }
    }
}

function applyBlur(ctx, x, y, width, height, sourceCtx = null) {
    console.log('applyBlur called:', { x, y, width, height, hasSourceCtx: !!sourceCtx });

    if (width < 5 || height < 5) {
        console.log('applyBlur: early return - size too small');
        return;
    }

    const source = sourceCtx || mainCtx;
    const sourceCanvas = source.canvas;

    console.log('applyBlur: sourceCanvas dimensions:', sourceCanvas.width, 'x', sourceCanvas.height);

    // Calculate the visible portion within canvas bounds
    const startX = Math.floor(x);
    const startY = Math.floor(y);
    const endX = Math.floor(x + width);
    const endY = Math.floor(y + height);

    // Clip to canvas bounds
    const canvasX = Math.max(0, startX);
    const canvasY = Math.max(0, startY);
    const canvasEndX = Math.min(sourceCanvas.width, endX);
    const canvasEndY = Math.min(sourceCanvas.height, endY);

    const canvasW = canvasEndX - canvasX;
    const canvasH = canvasEndY - canvasY;

    console.log('applyBlur: clipped region:', { canvasX, canvasY, canvasEndX, canvasEndY, canvasW, canvasH });

    if (canvasW <= 0 || canvasH <= 0) {
        console.log('applyBlur: early return - clipped size is zero or negative');
        return;
    }

    console.log('applyBlur: about to getImageData');
    const imageData = source.getImageData(canvasX, canvasY, canvasW, canvasH);
    console.log('applyBlur: got imageData, size:', imageData.data.length);
    const data = imageData.data;
    const blurRadius = 5;

    const output = new Uint8ClampedArray(data);

    for (let py = 0; py < canvasH; py++) {
        for (let px = 0; px < canvasW; px++) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                    const ny = py + dy;
                    const nx = px + dx;
                    if (ny >= 0 && ny < canvasH && nx >= 0 && nx < canvasW) {
                        const i = (ny * canvasW + nx) * 4;
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                }
            }

            const i = (py * canvasW + px) * 4;
            output[i] = Math.round(r / count);
            output[i + 1] = Math.round(g / count);
            output[i + 2] = Math.round(b / count);
            output[i + 3] = data[i + 3];
        }
    }

    const blurredData = new ImageData(output, canvasW, canvasH);
    console.log('applyBlur: about to putImageData at', canvasX, canvasY);
    ctx.putImageData(blurredData, canvasX, canvasY);
    console.log('applyBlur: completed successfully');
}

// Brush-style mosaic display (preview while drawing)
function drawMosaicBrushDisplay(ctx, points, lineWidth) {
    if (points.length < 1) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.lineWidth = lineWidth * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

// Brush-style blur display (preview while drawing)
function drawBlurBrushDisplay(ctx, points, lineWidth) {
    if (points.length < 1) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
    ctx.lineWidth = lineWidth * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
}

// Apply mosaic brush effect along path (optimized with pre-computed mask)
function applyMosaicBrush(ctx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blockSize = Math.max(8, Math.floor(lineWidth));
    const sourceCanvas = mainCanvas;

    // Get the bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius);
        minY = Math.min(minY, p.y - brushRadius);
        maxX = Math.max(maxX, p.x + brushRadius);
        maxY = Math.max(maxY, p.y + brushRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask using canvas (much faster than per-pixel check)
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    // Get combined image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceCanvas.width;
    tempCanvas.height = sourceCanvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(sourceCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;
    const currentDrawData = ctx.getImageData(minX, minY, width, height);
    const output = currentDrawData.data;

    // Apply mosaic using pre-computed mask
    for (let by = 0; by < height; by += blockSize) {
        for (let bx = 0; bx < width; bx += blockSize) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                    const px = bx + dx, py = by + dy;
                    const mi = (py * width + px) * 4;
                    if (maskData[mi] > 128) {
                        const i = mi;
                        r += data[i]; g += data[i + 1]; b += data[i + 2];
                        count++;
                    }
                }
            }

            if (count > 0) {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                    for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                        const px = bx + dx, py = by + dy;
                        const mi = (py * width + px) * 4;
                        if (maskData[mi] > 128) {
                            output[mi] = r; output[mi + 1] = g; output[mi + 2] = b; output[mi + 3] = 255;
                        }
                    }
                }
            }
        }
    }

    ctx.putImageData(new ImageData(output, width, height), minX, minY);
}

// Apply blur brush effect along path (optimized with pre-computed mask)
function applyBlurBrush(ctx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blurRadius = 4;
    const sourceCanvas = mainCanvas;

    // Get the bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius - blurRadius);
        minY = Math.min(minY, p.y - brushRadius - blurRadius);
        maxX = Math.max(maxX, p.x + brushRadius + blurRadius);
        maxY = Math.max(maxY, p.y + brushRadius + blurRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask using canvas
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    // Get combined image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceCanvas.width;
    tempCanvas.height = sourceCanvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(sourceCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;
    const currentDrawData = ctx.getImageData(minX, minY, width, height);
    const output = currentDrawData.data;

    // Fast box blur using separable passes (horizontal then vertical)
    let current = new Uint8ClampedArray(data);
    let temp = new Uint8ClampedArray(data.length);

    // 2-pass blur for smoother result
    for (let pass = 0; pass < 2; pass++) {
        // Horizontal blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                    const nx = px + dx;
                    if (nx >= 0 && nx < width) {
                        const j = (py * width + nx) * 4;
                        r += current[j]; g += current[j + 1]; b += current[j + 2];
                        count++;
                    }
                }
                temp[i] = r / count; temp[i + 1] = g / count; temp[i + 2] = b / count; temp[i + 3] = 255;
            }
        }
        // Vertical blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                    const ny = py + dy;
                    if (ny >= 0 && ny < height) {
                        const j = (ny * width + px) * 4;
                        r += temp[j]; g += temp[j + 1]; b += temp[j + 2];
                        count++;
                    }
                }
                current[i] = r / count; current[i + 1] = g / count; current[i + 2] = b / count; current[i + 3] = 255;
            }
        }
    }

    // Copy only masked pixels to output
    for (let i = 0; i < width * height; i++) {
        if (maskData[i * 4] > 128) {
            const idx = i * 4;
            output[idx] = current[idx];
            output[idx + 1] = current[idx + 1];
            output[idx + 2] = current[idx + 2];
            output[idx + 3] = 255;
        }
    }

    ctx.putImageData(new ImageData(output, width, height), minX, minY);
}

// Apply mosaic brush on specific canvas (for final output, optimized)
function applyMosaicBrushOnCanvas(ctx, sourceCtx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blockSize = Math.max(8, Math.floor(lineWidth));
    const sourceCanvas = sourceCtx.canvas;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius);
        minY = Math.min(minY, p.y - brushRadius);
        maxX = Math.max(maxX, p.x + brushRadius);
        maxY = Math.max(maxY, p.y + brushRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    const imageData = sourceCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);

    for (let by = 0; by < height; by += blockSize) {
        for (let bx = 0; bx < width; bx += blockSize) {
            let r = 0, g = 0, b = 0, count = 0;

            for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                    const px = bx + dx, py = by + dy;
                    const mi = (py * width + px) * 4;
                    if (maskData[mi] > 128) {
                        r += data[mi]; g += data[mi + 1]; b += data[mi + 2];
                        count++;
                    }
                }
            }

            if (count > 0) {
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                for (let dy = 0; dy < blockSize && by + dy < height; dy++) {
                    for (let dx = 0; dx < blockSize && bx + dx < width; dx++) {
                        const px = bx + dx, py = by + dy;
                        const mi = (py * width + px) * 4;
                        if (maskData[mi] > 128) {
                            output[mi] = r; output[mi + 1] = g; output[mi + 2] = b; output[mi + 3] = 255;
                        }
                    }
                }
            }
        }
    }

    ctx.putImageData(new ImageData(output, width, height), minX, minY);
}

// Apply blur brush on specific canvas (for final output, optimized)
function applyBlurBrushOnCanvas(ctx, sourceCtx, points, lineWidth) {
    if (!points || points.length < 2) return;

    const brushRadius = lineWidth * 2;
    const blurRadius = 4;
    const sourceCanvas = sourceCtx.canvas;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
        minX = Math.min(minX, p.x - brushRadius - blurRadius);
        minY = Math.min(minY, p.y - brushRadius - blurRadius);
        maxX = Math.max(maxX, p.x + brushRadius + blurRadius);
        maxY = Math.max(maxY, p.y + brushRadius + blurRadius);
    }

    minX = Math.max(0, Math.floor(minX));
    minY = Math.max(0, Math.floor(minY));
    maxX = Math.min(sourceCanvas.width, Math.ceil(maxX));
    maxY = Math.min(sourceCanvas.height, Math.ceil(maxY));

    if (maxX <= minX || maxY <= minY) return;

    const width = maxX - minX;
    const height = maxY - minY;

    // Pre-compute brush mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, width, height);
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushRadius * 2;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.beginPath();
    maskCtx.moveTo(points[0].x - minX, points[0].y - minY);
    for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x - minX, points[i].y - minY);
    }
    maskCtx.stroke();
    const maskData = maskCtx.getImageData(0, 0, width, height).data;

    const imageData = sourceCtx.getImageData(minX, minY, width, height);
    const data = imageData.data;

    // Fast separable blur
    let current = new Uint8ClampedArray(data);
    let temp = new Uint8ClampedArray(data.length);

    for (let pass = 0; pass < 2; pass++) {
        // Horizontal blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                    const nx = px + dx;
                    if (nx >= 0 && nx < width) {
                        const j = (py * width + nx) * 4;
                        r += current[j]; g += current[j + 1]; b += current[j + 2];
                        count++;
                    }
                }
                temp[i] = r / count; temp[i + 1] = g / count; temp[i + 2] = b / count; temp[i + 3] = 255;
            }
        }
        // Vertical blur
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                const i = (py * width + px) * 4;
                let r = 0, g = 0, b = 0, count = 0;
                for (let dy = -blurRadius; dy <= blurRadius; dy++) {
                    const ny = py + dy;
                    if (ny >= 0 && ny < height) {
                        const j = (ny * width + px) * 4;
                        r += temp[j]; g += temp[j + 1]; b += temp[j + 2];
                        count++;
                    }
                }
                current[i] = r / count; current[i + 1] = g / count; current[i + 2] = b / count; current[i + 3] = 255;
            }
        }
    }

    // Copy only masked pixels
    for (let i = 0; i < width * height; i++) {
        if (maskData[i * 4] > 128) {
            const idx = i * 4;
            data[idx] = current[idx];
            data[idx + 1] = current[idx + 1];
            data[idx + 2] = current[idx + 2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, minX, minY);
}

// Fill bucket tool with smart boundary detection
function applyFillBucket(x, y) {
    const color = colorPicker.value;
    const tolerance = 32;
    const fillColor = hexToRgb(color);
    if (!fillColor) return;

    const width = mainCanvas.width;
    const height = mainCanvas.height;
    const totalPixels = width * height;
    const startX = Math.floor(x);
    const startY = Math.floor(y);

    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    // Create temp canvas with current state
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCtx.drawImage(mainCanvas, 0, 0);
    tempCtx.drawImage(drawCanvas, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const startIdx = (startY * width + startX) * 4;
    const startColor = { r: data[startIdx], g: data[startIdx+1], b: data[startIdx+2], a: data[startIdx+3] };

    // Skip if clicking on same color
    if (colorsMatch(startColor, { ...fillColor, a: 255 }, 5)) return;

    // Flood fill to determine area
    const visited = new Uint8Array(width * height);
    const stack = [startY * width + startX];
    let fillCount = 0;

    while (stack.length > 0) {
        const pos = stack.pop();
        if (visited[pos]) continue;

        const cx = pos % width;
        const cy = Math.floor(pos / width);
        const idx = pos * 4;

        if (!colorsMatch(startColor, { r: data[idx], g: data[idx+1], b: data[idx+2], a: data[idx+3] }, tolerance)) continue;

        visited[pos] = 1;
        fillCount++;

        if (cx > 0) stack.push(pos - 1);
        if (cx < width - 1) stack.push(pos + 1);
        if (cy > 0) stack.push(pos - width);
        if (cy < height - 1) stack.push(pos + width);
    }

    // Create fill result
    const fillData = drawCtx.getImageData(0, 0, width, height);
    const fd = fillData.data;

    // If fill covers >70% of canvas, fill entire canvas
    if (fillCount > totalPixels * 0.7) {
        for (let i = 0; i < fd.length; i += 4) {
            fd[i] = fillColor.r;
            fd[i+1] = fillColor.g;
            fd[i+2] = fillColor.b;
            fd[i+3] = 255;
        }
    } else {
        // Use flood fill result
        for (let i = 0; i < visited.length; i++) {
            if (visited[i]) {
                const idx = i * 4;
                fd[idx] = fillColor.r;
                fd[idx+1] = fillColor.g;
                fd[idx+2] = fillColor.b;
                fd[idx+3] = 255;
            }
        }
    }

    drawCtx.putImageData(fillData, 0, 0);
    drawHistory.push({ shape: 'fillBucket', imageData: drawCtx.getImageData(0, 0, width, height), x: startX, y: startY, color });
    redoHistory = [];
    updateUndoRedoButtons();
}

// Helper functions for fill bucket
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorsMatch(c1, c2, tolerance) {
    return Math.abs(c1.r - c2.r) <= tolerance &&
           Math.abs(c1.g - c2.g) <= tolerance &&
           Math.abs(c1.b - c2.b) <= tolerance &&
           Math.abs(c1.a - c2.a) <= tolerance;
}

// Undo, Redo, and clear
function undoLastDraw() {
    if (drawHistory.length > 0) {
        const item = drawHistory.pop();
        redoHistory.push(item);
        clearDrawCanvas();
        redrawHistory();
        updateUndoRedoButtons();
    }
}

function redoLastDraw() {
    if (redoHistory.length > 0) {
        const item = redoHistory.pop();
        drawHistory.push(item);
        clearDrawCanvas();
        redrawHistory();
        updateUndoRedoButtons();
    }
}

function clearAllDrawings() {
    drawHistory = [];
    redoHistory = [];
    clearDrawCanvas();
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    undoBtn.disabled = drawHistory.length === 0;
    redoBtn.disabled = redoHistory.length === 0;
}

// Canvas drag-drop handlers
function handleCanvasDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    canvasContainer.classList.add('drag-over');
}

function handleCanvasDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    canvasContainer.classList.remove('drag-over');
}

function handleCanvasDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    canvasContainer.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        drawHistory = [];
        redoHistory = [];
        updateUndoRedoButtons();
        resultTabBtn.disabled = true;
        currentResultCanvas = null;
        switchTab('edit');
        loadImage(files[0]);
    }
}

// Result image drag handlers
function handleResultDragStart(e) {
    if (!currentResultCanvas) return;

    resultImage.classList.add('dragging');

    // Get format and quality settings
    const { mimeType, extension } = getFormatInfo(currentFormat);
    const quality = qualitySlider.value / 100;

    // Create data URL for the image
    const dataUrl = currentResultCanvas.toDataURL(mimeType, quality);
    const filename = `edited-image.${extension}`;

    // Set drag data for external applications
    e.dataTransfer.effectAllowed = 'copyMove';

    // Try to add file first (before any setData calls)
    let fileAdded = false;
    if (currentResultBlob && e.dataTransfer.items) {
        try {
            const file = new File([currentResultBlob], filename, { type: mimeType });
            e.dataTransfer.items.add(file);
            fileAdded = true;
        } catch (err) {
            console.log('Could not add file to drag:', err);
        }
    }

    // DownloadURL format allows dragging to desktop/file explorer (Chrome)
    e.dataTransfer.setData('DownloadURL', `${mimeType}:${filename}:${dataUrl}`);

    // Only add text fallbacks if file wasn't added
    if (!fileAdded) {
        e.dataTransfer.setData('text/uri-list', dataUrl);
    }

    // Set drag image
    e.dataTransfer.setDragImage(resultImage, resultImage.width / 2, resultImage.height / 2);
}

function handleResultDragEnd(e) {
    resultImage.classList.remove('dragging');
}

// Export functions
function generateResultCanvas() {
    console.log('=== generateResultCanvas START ===');
    if (!image) return null;

    console.log('image dimensions:', image.width, 'x', image.height);
    console.log('cropState:', JSON.stringify(cropState));
    console.log('scale:', scale);
    console.log('drawHistory length:', drawHistory.length);

    const actualX = cropState.x / scale;
    const actualY = cropState.y / scale;
    const actualWidth = cropState.width / scale;
    const actualHeight = cropState.height / scale;

    const finalWidth = targetDimensions ? targetDimensions.width : Math.round(actualWidth);
    const finalHeight = targetDimensions ? targetDimensions.height : Math.round(actualHeight);

    // Use integer dimensions to avoid canvas size issues
    const canvasWidth = Math.round(actualWidth);
    const canvasHeight = Math.round(actualHeight);

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    console.log('generateResultCanvas: canvasWidth:', canvasWidth, 'canvasHeight:', canvasHeight);

    tempCtx.drawImage(
        image,
        actualX, actualY, actualWidth, actualHeight,
        0, 0, canvasWidth, canvasHeight
    );

    if (drawHistory.length > 0) {
        // Create a source canvas for blur/mosaic operations
        const sourceCanvas = document.createElement('canvas');
        const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
        sourceCanvas.width = canvasWidth;
        sourceCanvas.height = canvasHeight;
        sourceCtx.drawImage(tempCanvas, 0, 0);

        const brushTypes = ['pen', 'marker', 'watercolor', 'crayon', 'highlighter', 'eraser'];

        for (const item of drawHistory) {
            tempCtx.save();

            if (item.shape === 'fillBucket') {
                // For fill bucket, we need to scale the imageData
                if (item.imageData) {
                    // Create a temp canvas with the stored imageData
                    const fillCanvas = document.createElement('canvas');
                    fillCanvas.width = item.imageData.width;
                    fillCanvas.height = item.imageData.height;
                    const fillCtx = fillCanvas.getContext('2d', { willReadFrequently: true });
                    fillCtx.putImageData(item.imageData, 0, 0);

                    // Draw scaled and offset to output
                    tempCtx.drawImage(
                        fillCanvas,
                        cropState.x, cropState.y, cropState.width, cropState.height,
                        0, 0, canvasWidth, canvasHeight
                    );
                }
            } else if (brushTypes.includes(item.shape)) {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                drawPenStroke(tempCtx, scaledPoints, item.color, item.lineWidth / scale, item.penType || item.shape);
            } else if (item.shape === 'mosaic') {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                applyMosaicBrushOnCanvas(tempCtx, sourceCtx, scaledPoints, item.lineWidth / scale);
            } else if (item.shape === 'blur') {
                const scaledPoints = item.points.map(p => ({
                    x: (p.x - cropState.x) / scale,
                    y: (p.y - cropState.y) / scale
                }));
                applyBlurBrushOnCanvas(tempCtx, sourceCtx, scaledPoints, item.lineWidth / scale);
            } else if (item.shape === 'text') {
                const scaledX = (item.x - cropState.x) / scale;
                const scaledY = (item.y - cropState.y) / scale;
                drawText(tempCtx, item.text, scaledX, scaledY, item.color, item.fontSize / scale);
            } else {
                const scaledX1 = (item.x1 - cropState.x) / scale;
                const scaledY1 = (item.y1 - cropState.y) / scale;
                const scaledX2 = (item.x2 - cropState.x) / scale;
                const scaledY2 = (item.y2 - cropState.y) / scale;
                drawShape(tempCtx, item.shape, scaledX1, scaledY1, scaledX2, scaledY2, item.color, item.lineWidth / scale, item.fill, sourceCtx);
            }

            tempCtx.restore();
        }
    }

    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d', { willReadFrequently: true });
    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;

    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = 'high';
    outputCtx.drawImage(tempCanvas, 0, 0, finalWidth, finalHeight);

    return outputCanvas;
}

function getFormatInfo(format) {
    const formats = {
        'png': { mimeType: 'image/png', extension: 'png' },
        'jpeg': { mimeType: 'image/jpeg', extension: 'jpg' },
        'webp': { mimeType: 'image/webp', extension: 'webp' }
    };
    return formats[format] || formats['png'];
}

function showResult() {
    currentResultCanvas = generateResultCanvas();
    if (!currentResultCanvas) return;

    const { mimeType } = getFormatInfo(currentFormat);
    const quality = qualitySlider.value / 100;

    // Pre-generate blob for drag and drop
    currentResultCanvas.toBlob((blob) => {
        currentResultBlob = blob;
    }, mimeType, quality);

    resultImage.src = currentResultCanvas.toDataURL('image/png');
    resultTabBtn.disabled = false;
    switchTab('result');
}

function downloadImage() {
    if (!image) return;

    // Generate result canvas on-the-fly
    const canvas = generateResultCanvas();
    if (!canvas) return;

    const { mimeType, extension } = getFormatInfo(currentFormat);
    const quality = qualitySlider.value / 100;

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.download = `edited-image.${extension}`;
    link.href = dataUrl;
    link.click();
}

async function copyImageToClipboard() {
    if (!image) return;

    try {
        // Generate result canvas on-the-fly
        const canvas = generateResultCanvas();
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);

        copyBtn.classList.add('success');
        setTimeout(() => {
            copyBtn.classList.remove('success');
        }, 1500);
    } catch (err) {
        console.error('複製失敗:', err);
        copyBtn.classList.add('error');
        setTimeout(() => {
            copyBtn.classList.remove('error');
        }, 1500);
    }
}

// Result page download function
function downloadResultImage() {
    if (!resultImage || !resultImage.src) return;

    const link = document.createElement('a');
    const { extension } = getFormatInfo(currentFormat);
    link.download = `edited-image.${extension}`;
    link.href = resultImage.src;
    link.click();
}

// Result page copy function
async function copyResultImageToClipboard() {
    if (!resultImage || !resultImage.src) return;

    try {
        const response = await fetch(resultImage.src);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);

        resultCopyBtn.classList.add('success');
        setTimeout(() => {
            resultCopyBtn.classList.remove('success');
        }, 1500);
    } catch (err) {
        console.error('複製失敗:', err);
        resultCopyBtn.classList.add('error');
        setTimeout(() => {
            resultCopyBtn.classList.remove('error');
        }, 1500);
    }
}

// Initialize
init();
