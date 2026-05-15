import emailjs from "@emailjs/browser";

export const EMAIL_SERVICE_ID = "service_9ewt045";
export const EMAIL_TEMPLATE_ID = "template_hw6ison";
export const EMAIL_PUBLIC_KEY = "T3XC6MrWjFZAzNa2b";

export function sendEmailNotification(templateParams: any) {
  return emailjs.send(
    EMAIL_SERVICE_ID,
    EMAIL_TEMPLATE_ID,
    templateParams,
    EMAIL_PUBLIC_KEY
  );
}