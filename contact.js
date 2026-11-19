const contactForm = document.querySelector("#contact-form");
const contactMessage = document.querySelector("#contact-message");
const formHint = document.querySelector("#form-hint");
const whatsappNumber = "201095295675";

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#contact-name").value.trim();
  const phone = document.querySelector("#contact-phone").value.trim();
  const message = contactMessage.value.trim();
  if (!message) {
    contactMessage.focus();
    return;
  }

  const messageParts = [
    `مرحبًا، أنا ${name || "عميل إيلان"}.`,
    ...(phone ? [`رقم التواصل: ${phone}`] : []),
    "أرغب في الاستفسار عن:",
    message
  ];
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageParts.join("\n"))}`;

  formHint.textContent = "جارٍ فتح واتساب برسالتك...";
  window.location.assign(whatsappUrl);
});
