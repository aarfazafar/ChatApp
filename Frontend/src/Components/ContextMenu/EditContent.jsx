import React from 'react'

const EditContent = () => (
  <div>
    <h2 className="text-lg font-semibold mb-2">Edit Item</h2>
    <input className="border p-2 w-full rounded" placeholder="Edit text here..." />
    <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">Save</button>
  </div>
);

export default EditContent;