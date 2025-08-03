import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "+93795582109";
  const message = "Hello website admin!";
  const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50"
    >
      <div
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg animate-bounce transition-transform duration-300 hover:scale-110"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </div>
    </a>
  );
}
