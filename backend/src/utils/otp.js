export const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

export const generateResetToken = () =>
  `${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
