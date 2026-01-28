// Initialize data from localStorage
let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
let videos = JSON.parse(localStorage.getItem('videos')) || [];

// Display team members on page load
document.addEventListener('DOMContentLoaded', () => {
    displayTeamMembers();
    displayVideos();
});

// Display team members
function displayTeamMembers() {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';

    if (teamMembers.length === 0) {
        teamGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; font-size: 1.1rem;">No team members yet. Click "Add Team Member" to get started!</p>';
        return;
    }

    teamMembers.forEach((member, index) => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member';
        memberCard.innerHTML = `
            <img src="${member.photo}" alt="${member.name}" class="member-image">
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-gamename">${member.gameName}</div>
                <div class="member-role">${member.role}</div>
                <div class="member-bio">${member.bio}</div>
                <button class="delete-member" onclick="deleteTeamMember(${index})">Delete</button>
            </div>
        `;
        teamGrid.appendChild(memberCard);
    });
}

// Display videos
function displayVideos() {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = '';

    if (videos.length === 0) {
        videosGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; font-size: 1.1rem;">No videos uploaded yet. Upload your first highlight!</p>';
        return;
    }

    videos.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <video class="video-thumbnail" style="cursor: pointer;" onclick="playVideo(${index})">
                <source src="${video.file}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-controls">
                    <button class="btn-play" onclick="playVideo(${index})">Play</button>
                    <button class="btn-delete" onclick="deleteVideo(${index})">Delete</button>
                </div>
            </div>
        `;
        videosGrid.appendChild(videoCard);
    });
}

// Open modal for adding team member
function openAddMemberForm() {
    document.getElementById('memberModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('memberModal').style.display = 'none';
    document.getElementById('memberForm').reset();
}

// Add team member
function addTeamMember() {
    const name = document.getElementById('memberName').value;
    const gameName = document.getElementById('memberGameName').value;
    const role = document.getElementById('memberRole').value;
    const bio = document.getElementById('memberBio').value;
    const photoFile = document.getElementById('memberPhoto').files[0];

    if (!name || !gameName || !role || !bio || !photoFile) {
        alert('Please fill in all fields!');
        return;
    }

    // Read image as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
        const newMember = {
            name: name,
            gameName: gameName,
            role: role,
            bio: bio,
            photo: e.target.result
        };

        teamMembers.push(newMember);
        localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
        displayTeamMembers();
        closeModal();
        alert('Team member added successfully!');
    };
    reader.readAsDataURL(photoFile);
}

// Delete team member
function deleteTeamMember(index) {
    if (confirm('Are you sure you want to delete this team member?')) {
        teamMembers.splice(index, 1);
        localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
        displayTeamMembers();
    }
}

// Handle video upload
function handleVideoUpload() {
    const videoFile = document.getElementById('videoUpload').files[0];
    if (videoFile) {
        console.log('Video selected:', videoFile.name);
    }
}

// Upload video
function uploadVideo() {
    const title = document.getElementById('videoTitle').value;
    const videoFile = document.getElementById('videoUpload').files[0];

    if (!title || !videoFile) {
        alert('Please enter a title and select a video!');
        return;
    }

    // Read video as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
        const newVideo = {
            title: title,
            file: e.target.result
        };

        videos.push(newVideo);
        localStorage.setItem('videos', JSON.stringify(videos));
        displayVideos();
        
        // Clear inputs
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoUpload').value = '';
        
        alert('Video uploaded successfully!');
    };
    reader.readAsDataURL(videoFile);
}

// Play video
function playVideo(index) {
    alert('Playing: ' + videos[index].title + '\n\nNote: In a production environment, this would open a video player.');
    // In production, you could use a video player library like Video.js
}

// Delete video
function deleteVideo(index) {
    if (confirm('Are you sure you want to delete this video?')) {
        videos.splice(index, 1);
        localStorage.setItem('videos', JSON.stringify(videos));
        displayVideos();
    }
}

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('memberModal');
    if (event.target === modal) {
        closeModal();
    }
}
