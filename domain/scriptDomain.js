// Cloudinary cloud name
const CLOUDINARY_CLOUD_NAME = 'dzvojulwb'; // Replace with your Cloudinary Cloud name
const CLOUDINARY_UPLOAD_PRESET = 'DVDnet'; // Replace with your Cloudinary upload preset

// Select elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const sendButton = document.getElementById('send-button');
const form = document.getElementById('upload-form');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

// Variables to hold the selected file
let selectedFile = null;

// Handle drag and drop events
dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropArea.classList.add('dragging');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragging');
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  dropArea.classList.remove('dragging');
  const file = event.dataTransfer.files[0];
  handleFileSelection(file);
});

// Handle browse button click
document.getElementById('browse-link').addEventListener('click', () => {
  fileInput.click();
});

// Handle file input change
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  handleFileSelection(file);
});

// Handle file selection
function handleFileSelection(file) {
  if (file) {
    selectedFile = file;
    fileInfo.innerHTML = `
      <p>File name: ${file.name}</p>
      <p>File size: ${(file.size / 1024).toFixed(2)} KB</p>
      <p>File type: ${file.type}</p>
    `;
    sendButton.disabled = false;
  }
}

// Prevent form submission and upload the file to Cloudinary
form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (selectedFile) {
    // Show progress bar
    progressContainer.style.display = 'block';

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, true);

    // Monitor upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        progressBar.style.width = `${progress}%`;
      }
    };

    // Handle successful upload
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const fileUrl = response.secure_url;

        // Display file information
        fileInfo.innerHTML = `
          <p>File uploaded successfully!</p>
          <p>File URL: <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>
        `;

        // Reset form
        sendButton.disabled = true;
        progressBar.style.width = '0%';
        progressContainer.style.display = 'none';
      } else {
        alert('Error uploading file');
      }
    };

    // Handle upload error
    xhr.onerror = () => {
      alert('Error uploading file');
    };

    // Send the file to Cloudinary
    xhr.send(formData);
  }
});
