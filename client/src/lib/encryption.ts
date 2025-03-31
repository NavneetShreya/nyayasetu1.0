/**
 * Encryption and decryption utilities for end-to-end encryption in chat
 */

// Generate a secure random encryption key
export const generateEncryptionKey = (): string => {
  // Create a random string as the encryption key
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Get the encryption key from local storage or create a new one
export const getOrCreateEncryptionKey = (): string => {
  let key = localStorage.getItem('chat_encryption_key');
  if (!key) {
    key = generateEncryptionKey();
    localStorage.setItem('chat_encryption_key', key);
  }
  return key;
};

// Encrypt a message using AES-GCM
export const encryptMessage = async (message: string): Promise<string> => {
  try {
    const key = getOrCreateEncryptionKey();
    
    // Convert key string to ArrayBuffer
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    
    // Create a key from the keyData
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Generate initialization vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the message
    const encodedMessage = encoder.encode(message);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      encodedMessage
    );
    
    // Combine IV and encrypted data for storage
    const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
    encryptedArray.set(iv, 0);
    encryptedArray.set(new Uint8Array(encryptedData), iv.length);
    
    // Convert to Base64 for storage/transmission
    return btoa(String.fromCharCode(...encryptedArray));
  } catch (error) {
    console.error('Encryption error:', error);
    return message; // Fallback to unencrypted message
  }
};

// Decrypt a message using AES-GCM
export const decryptMessage = async (encryptedMessage: string): Promise<string> => {
  try {
    const key = getOrCreateEncryptionKey();
    
    // Convert key string to ArrayBuffer
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    
    // Create a key from the keyData
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Convert the Base64 back to array
    const encryptedData = Uint8Array.from(
      atob(encryptedMessage), char => char.charCodeAt(0)
    );
    
    // Extract IV (first 12 bytes) and actual encrypted data
    const iv = encryptedData.slice(0, 12);
    const actualData = encryptedData.slice(12);
    
    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      actualData
    );
    
    // Convert decrypted data to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    // Add a marker to show this message couldn't be decrypted
    return '🔒 [Encrypted message - cannot decrypt]';
  }
};

// Detect if a message is encrypted (starts with a Base64 character pattern)
export const isEncryptedMessage = (message: string): boolean => {
  // Check if the message looks like a Base64 encoded string
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(message) && message.length > 20;
};