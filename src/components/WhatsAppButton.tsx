const WhatsAppButton = () => {
  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth > 768) {
      e.preventDefault();
      window.dispatchEvent(new Event("close-product-modal"));
      setTimeout(() => {
        const element = document.getElementById("get-quote");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            const input = element.querySelector("input");
            if (input) input.focus();
          }, 800);
        }
      }, 100);
    }
  };

  return (
    <a
      id="whatsapp-button"
      href="https://wa.me/919618012403"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      aria-label="Chat on WhatsApp"
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#25D366"/>
        <path d="M20 2C10.06 2 2 10.06 2 20c0 2.84.67 5.52 1.88 7.88L2.88 38l10.52-2.68C14.48 37.33 17.15 38 20 38c9.94 0 18-8.06 18-18S29.94 2 20 2zm0 33c-2.32 0-4.56-.55-6.52-1.52l-.47-.24-4.87 1.24 1.27-4.63-.26-.42C4.56 24.73 4 22.44 4 20c0-8.84 7.16-16 16-16s16 7.16 16 16-7.16 16-16 16z" fill="white"/>
        <path d="M28.5 24.49c-.51-.26-3.02-1.49-3.48-1.66-.47-.17-.81-.26-1.15.26-.34.51-1.33 1.66-1.63 2.01-.3.34-.59.38-1.1.13-.51-.26-2.15-0.79-4.09-2.53-1.51-1.35-2.54-3.01-2.84-3.52-.3-.51-.03-.78.23-1.03.23-.23.51-.59.77-.89.25-.3.34-.51.51-.85.17-.34.09-.64-.04-.89-.13-.26-1.15-2.76-1.57-3.78-.41-1.00-0.83-0.86-1.15-.88-.30-.02-.63-.02-.97-.02-.34 0-.89.13-1.36.63-.47.51-1.78 1.74-1.78 4.24 0 2.50 1.82 4.91 2.07 5.27.25.36 3.43 5.27 8.34 7.37 1.16.50 2.07.81 2.78.99 1.16.31 2.22.26 3.05.16.93-.13 2.86-.93 3.28-1.82.42-.89.42-1.65.30-1.82-.13-.17-.47-.26-.98-.52z" fill="white"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;
