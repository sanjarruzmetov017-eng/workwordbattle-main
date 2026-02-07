
import React from 'react';

const Support: React.FC = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black mb-2">Help Center</h2>
        <p className="text-gray-500">Need assistance? Our battle masters are here to help.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-[#242424] p-8 rounded-3xl border border-gray-800 text-center hover:bg-[#2a2a2a] transition group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition">❓</div>
            <h4 className="font-bold">FAQs</h4>
            <p className="text-xs text-gray-500 mt-2">Quick answers to common questions.</p>
          </button>
          <button className="bg-[#242424] p-8 rounded-3xl border border-gray-800 text-center hover:bg-[#2a2a2a] transition group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition">🛠️</div>
            <h4 className="font-bold">Bug Report</h4>
            <p className="text-xs text-gray-500 mt-2">Help us squash those glitches.</p>
          </button>
        </div>

        <div className="bg-[#242424] p-10 rounded-3xl border border-gray-800">
          <h3 className="text-xl font-bold mb-6">Send Message</h3>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Subject</label>
              <select className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-4 text-sm outline-none focus:border-green-500">
                <option>Account Issue</option>
                <option>Billing / Premium</option>
                <option>Game Rules</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Message</label>
              <textarea rows={5} className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-4 text-sm outline-none focus:border-green-500 resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-4 bg-green-500 text-black font-black rounded-xl hover:bg-green-600 transition">SUBMIT TICKET</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
