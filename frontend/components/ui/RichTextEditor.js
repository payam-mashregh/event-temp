import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// --- START: The Fix for "document is not defined" ---
// We use dynamic import to ensure that ReactQuill is only loaded on the client-side.
// The ssr: false option is critical here.
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// --- END: The Fix ---

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

export default function RichTextEditor({ value, onChange }) {
    return (
        <div className="bg-white">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                style={{ height: '300px', marginBottom: '40px' }}
            />
        </div>
    );
}