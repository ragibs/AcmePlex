export function generatePaymentConfirmationNumber(length: number = 7): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let confirmationNumber = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    confirmationNumber += characters[randomIndex];
  }

  return confirmationNumber;
}
