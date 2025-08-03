import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
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
        className="bg-green-500 hover:bg-green-600 flex gap-4 text-white p-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 justify-center items-center"
        title="Chat on WhatsApp"
      >
        <p className="text-sm">Contact Developer</p>
        <FaWhatsapp className="text-xl" />
      </div>
    </a>
  );
}
