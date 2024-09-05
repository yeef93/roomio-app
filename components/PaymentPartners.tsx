import Image from "next/image";

const PaymentPartners = () => {
  return (
    <div className="text-gray-800 px-4">
      {/* Payment Partners Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Payment Partners</h2>
      </div>

      {/* Grid for payment logos */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/bca.png"
            alt="BCA"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/mandiri.png"
            alt="Mandiri"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/bni.png"
            alt="BNI"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/bri.png"
            alt="BRI"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/visa.png"
            alt="Visa"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/mastercard.png"
            alt="MasterCard"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/alfamart.png"
            alt="Alfamart"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/assets/payment/alfamidi.png"
            alt="Alfamidi"
            width={50}
            height={20}
            className="grayscale hover:grayscale-0"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPartners;
