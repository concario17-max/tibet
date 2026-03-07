/**
 * Gita 스타일 시간 포맷터 (HH:MM:SS)
 * @param {number} time - Seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (time) => {
    if (isNaN(time) || time === null) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
