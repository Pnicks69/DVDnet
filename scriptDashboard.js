// Cloudinary API Credentials
const cloudName = 'dzvojulwb';  // Replace with your cloud name
const apiKey = '153917679264924';  // Replace with your API key
const apiSecret = 'hdK58jnLasYQfFy82jZakt4aM3M';  // Replace with your API secret

// Function to fetch files from Cloudinary and populate the table
async function loadFiles() {
    try {
        const response = await axios.get(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`, {
            auth: {
                username: apiKey,
                password: apiSecret,
            },
        });

        const files = response.data.resources;
        const fileListBody = document.getElementById('file-list-body');

        // Clear the file list before adding new files
        fileListBody.innerHTML = '';

        // Populate the file list table with the fetched files
        files.forEach((file) => {
            const row = document.createElement('tr');

            // File name cell
            const fileNameCell = document.createElement('td');
            fileNameCell.textContent = file.public_id;

            // File size cell
            const fileSizeCell = document.createElement('td');
            fileSizeCell.textContent = (file.bytes / 1024).toFixed(2) + ' KB';

            // File type cell
            const fileTypeCell = document.createElement('td');
            fileTypeCell.textContent = file.format;

            // Action buttons cell (View and Delete)
            const actionsCell = document.createElement('td');
            const viewButton = document.createElement('button');
            viewButton.textContent = 'View';
            viewButton.classList.add('view-button');
            viewButton.onclick = () => window.open(file.secure_url, '_blank');

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = async () => {
                try {
                    // Call Cloudinary API to delete the file
                    await axios.delete(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`, {
                        data: { public_id: file.public_id },
                        auth: {
                            username: apiKey,
                            password: apiSecret,
                        },
                    });

                    // Remove the file from the table
                    fileListBody.removeChild(row);
                } catch (error) {
                    alert('Failed to delete the file');
                }
            };

            actionsCell.appendChild(viewButton);
            actionsCell.appendChild(deleteButton);

            row.appendChild(fileNameCell);
            row.appendChild(fileSizeCell);
            row.appendChild(fileTypeCell);
            row.appendChild(actionsCell);

            fileListBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching files from Cloudinary', error);
        alert('Failed to load files');
    }
}

// Load files when the page loads
window.addEventListener('DOMContentLoaded', loadFiles);
