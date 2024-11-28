import React, { useState } from 'react'

const AddSubject = () => {

    const [formData, setFormData] = useState({ name: '', files: [] })

    return (
        <div className='w-full flex flex-col items-start justify-start'>
            <input type="text" value={formData.name} id='name' onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} className='border p-2 m-3 rounded-md' />
            <input type="file" value={formData.name} id='files' onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })} className='border m-3' />
        </div>
    )
}

export default AddSubject