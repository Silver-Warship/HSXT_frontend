const getAudio = (base64Data: string) => {
  try {
    const typeMatch = base64Data.match(/^data:(audio\/\w+);base64,/);
    const audioType = typeMatch ? typeMatch[1] : 'audio/mpeg';
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      const byte = byteCharacters.charCodeAt(i);
      byteArrays.push(byte);
    }
    const blob = new Blob([new Uint8Array(byteArrays)], { type: audioType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting base64 to audio URL:', error);
    return null;
  }
};

export default getAudio;
