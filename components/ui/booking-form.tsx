import React from "react";

interface BookingFormProps {
  destinationId: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ destinationId }) => {
  return (
    <form className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto flex flex-col gap-4">
      <input type="hidden" name="destinationId" value={destinationId} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" required className="mt-1 block w-full border rounded-md p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" required className="mt-1 block w-full border rounded-md p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input type="date" name="date" required className="mt-1 block w-full border rounded-md p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Travelers</label>
        <input type="number" name="travelers" min={1} required className="mt-1 block w-full border rounded-md p-2" />
      </div>
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition">Book Now</button>
    </form>
  );
};

export default BookingForm;
