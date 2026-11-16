/*
 * Material You New Tab
 * Copyright (c) 2024-2026 Prem, 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// Wallpaper dim slider: 0-80% black layer over the wallpaper, saved as "bgDim".
// The bar is 20-100% wide like the opacity bar, so dim = bar width - 20.
const DIM_MAX = 80;
const dimBar = document.getElementById("dimBar");
const dimSlider = document.getElementById("dimSlider");
const dimLevel = document.getElementById("dimLevel");

function setDim(dim) {
    const value = Math.min(DIM_MAX, Math.max(0, Math.round(dim)));
    dimSlider.style.width = `${value + 20}%`;
    dimLevel.textContent = `${localizeNumbers(value.toString(), currentLanguage)}%`;
    dimBar.setAttribute("aria-valuenow", value);
    document.documentElement.style.setProperty("--bg-dim", value / 100);
    localStorage.setItem("bgDim", value);
}

function handleDimDrag(e) {
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const rect = dimBar.getBoundingClientRect();
    const pos = isRTL ? rect.right - clientX : clientX - rect.left;
    const percentage = Math.max(0, Math.min(rect.width, pos)) / rect.width * 100;
    setDim(percentage - 20);
}

function startDimDrag() {
    const onEnd = () => {
        ["mousemove", "touchmove"].forEach(evt => document.removeEventListener(evt, handleDimDrag));
        ["mouseup", "touchend"].forEach(evt => document.removeEventListener(evt, onEnd));
    };
    ["mousemove", "touchmove"].forEach(evt => document.addEventListener(evt, handleDimDrag));
    ["mouseup", "touchend"].forEach(evt => document.addEventListener(evt, onEnd));
}

["mousedown", "touchstart"].forEach(evt => {
    dimBar.addEventListener(evt, e => {
        e.preventDefault();
        handleDimDrag(e);
        startDimDrag();
    }, { passive: false });
});

dimBar.addEventListener("keydown", e => {
    const current = Number(dimBar.getAttribute("aria-valuenow"));
    const forward = isRTL ? "ArrowLeft" : "ArrowRight";
    const backward = isRTL ? "ArrowRight" : "ArrowLeft";
    if (e.key === forward || e.key === "ArrowUp") setDim(current + 5);
    else if (e.key === backward || e.key === "ArrowDown") setDim(current - 5);
    else if (e.key === "Home") setDim(0);
    else if (e.key === "End") setDim(DIM_MAX);
    else return;
    e.preventDefault();
});

setDim(Number(localStorage.getItem("bgDim")) || 0);
