import React from 'react';

function GBAEmulator() {
  const handleEmulatorClick = () => {
    const emulatorWindow = window.open('/src/emulatorjs_gba/index.html', '_blank');
    if (emulatorWindow) {
      emulatorWindow.focus();
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto text-center">
        <button
          onClick={handleEmulatorClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
        >
          Launch GBA Emulator
        </button>
      </div>
    </div>
  );
}

export default GBAEmulator; 