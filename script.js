// ---------- State ----------
let currentUser = null;
let posts = [];

let users = [
    { username: 'Lamp', password: 'bright', bio: 'I light up the room!', followers: 3 },
    { username: 'Chair', password: 'sitdown', bio: 'Comfortable all day.', followers: 5 },
    { username: 'Fridge', password: 'coolme', bio: 'Always chill. ❄️', followers: 8 },
    { username: 'Spoon', password: 'stiritup', bio: 'Serving up sass.', followers: 4 },
    { username: 'Clock', password: 'ticktock', bio: 'Always on time ⏰', followers: 10 },
    { username: 'Mirror', password: 'reflect', bio: 'I reflect on everything.', followers: 6 },
    { username: 'Cushion', password: 'softlife', bio: 'Softest in the house.', followers: 7 },
    { username: 'Fan', password: 'blowaway', bio: 'I blow minds 🚨', followers: 3 },
    { username: 'Notebook', password: 'scribble', bio: 'Full of secrets.', followers: 9 },
    { username: 'Bottle', password: 'hydrate', bio: 'Keeping things cool.', followers: 5 },
    { username: 'Pen', password: 'inked', bio: 'Writes my own story.', followers: 6 },
    { username: 'Mug', password: 'cozycup', bio: 'Hot stuff inside ☕', followers: 4 },
    { username: 'Plant', password: 'growme', bio: 'Leaf me alone 🌱', followers: 11 },
    { username: 'Pillow', password: 'dreamy', bio: 'Head in the clouds.', followers: 8 },
    { username: 'Keyboard', password: 'clicky', bio: 'Always typing.', followers: 10 },
    { username: 'Shoe', password: 'stepup', bio: 'On the right path 🍿', followers: 6 },
    { username: 'Curtain', password: 'shade', bio: 'Throwing shade daily.', followers: 7 },
    { username: 'Remote', password: 'control', bio: 'I run the show 📺', followers: 9 },
    { username: 'Book', password: 'readme', bio: 'Judge me by my cover.', followers: 12 },
    { username: 'Toothbrush', password: 'minty', bio: 'Fighting plaque with style.', followers: 5 }
];

let chatMessages = [
    {
        sender: "Lamp",
        text: "Hey Bottle, are you there?",
        timestamp: "09:00 AM",
        reactions: [],
        seenBy: ["Lamp"],
        file: null,
        type: "text"
    },
    // ... (rest of the 20 chatMessages)
];

// ---------- Navigation ----------
function navigate(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`${section}-section`).classList.remove('hidden');
    document.getElementById('main-nav').classList.remove('hidden');
}

// ---------- Login ----------
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-nav').classList.remove('hidden');
        navigate('feed');
        loadProfile();
        loadPosts();
    } else {
        alert("Invalid object name or secret word!");
    }
}

function logout() {
    currentUser = null;
    document.getElementById('main-nav').classList.add('hidden');
    navigateToLogin();
}

function navigateToLogin() {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById('login-section').classList.remove('hidden');
}

// ---------- Post ----------
function showPostModal() {
    document.getElementById('post-modal').classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
}

function closePostModal() {
    document.getElementById('post-modal').classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('post-content').value = '';
    document.getElementById('post-image').value = '';
}

function createPost() {
    const content = document.getElementById('post-content').value.trim();
    const image = document.getElementById('post-image').files[0];

    if (!content && !image) {
        alert("Post cannot be empty!");
        return;
    }
    const post = {
        author: currentUser.username,
        content: content,
        imageURL: image ? URL.createObjectURL(image) : null,
        timestamp: new Date().toLocaleString(),
        likes: [],
        comments: []
    };

    posts.unshift(post);
    closePostModal();
    loadPosts();
    loadProfilePosts();
}

// ---------- Feed ----------
function loadPosts() {
    const feed = document.getElementById('feed-posts');
    feed.innerHTML = '';

    const selectedFilter = document.getElementById('filter-select').value;
    const filteredPosts = selectedFilter === 'all' ? posts : posts.filter(p => p.author === selectedFilter);

    filteredPosts.forEach((post, index) => {
        const postEl = document.createElement('div');
        postEl.className = 'post';

        const commentsHTML = post.comments.map(c => `<div style="margin:4px 0;"><strong>${c.user}:</strong> ${c.text}</div>`).join('');

        postEl.innerHTML = `
            <strong>${post.author}</strong><br>
            <p>${post.content}</p>
            ${post.imageURL ? `<img src="${post.imageURL}" style="max-width:100%; margin-top:10px;">` : ''}
            <div style="font-size:0.8rem; margin-top:5px;">${post.timestamp}</div>
            <div class="actions">
                <button onclick="toggleLike(${index})">❤️ ${post.likes.length}</button>
                <button onclick="toggleCommentBox(${index})">💬 Comment</button>
                <button onclick="sharePost('${post.content}')">📤 Share</button>
            </div>
            <div id="comment-box-${index}" class="hidden">
                <input type="text" id="comment-input-${index}" placeholder="Add a comment...">
                <button onclick="addComment(${index})">Post</button>
            </div>
            <div class="comments">${commentsHTML}</div>
        `;
        feed.appendChild(postEl);
    });

    updateFilterOptions();
}

function updateFilterOptions() {
    const select = document.getElementById('filter-select');
    const authors = [...new Set(posts.map(p => p.author))];

    select.innerHTML = '<option value="all">All Objects</option>';
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        select.appendChild(option);
    });
}

function filterFeed() {
    loadPosts();
}

function toggleLike(index) {
    const post = posts[index];
    const user = currentUser.username;
    const liked = post.likes.includes(user);

    if (liked) {
        post.likes = post.likes.filter(u => u !== user);
    } else {
        post.likes.push(user);
    }

    loadPosts();
    loadProfilePosts();
}

function toggleCommentBox(index) {
    const box = document.getElementById(`comment-box-${index}`);
    box.classList.toggle('hidden');
}

function addComment(index) {
    const input = document.getElementById(`comment-input-${index}`);
    const text = input.value.trim();
    if (!text) return;

    posts[index].comments.push({
        user: currentUser.username,
        text: text
    });

    input.value = '';
    loadPosts();
    loadProfilePosts();
}

function sharePost(content) {
    navigator.clipboard.writeText(content);
    alert("Post copied to clipboard! 📋");
}

// ---------- Chat ----------
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    const msg = {
        sender: currentUser.username,
        text: text,
        timestamp: new Date().toLocaleTimeString(),
        reactions: [],
        seenBy: [currentUser.username],
        file: null,
        type: "text"
    };

    chatMessages.push(msg);
    input.value = '';
    updateChat();
}

function updateChat() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';

    chatMessages.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-message';

        let content = '';
        if (msg.type === 'text') {
            content = msg.text;
        } else if (msg.type === 'file') {
            content = `<a href="${msg.file}" target="_blank">📎 File</a>`;
        } else if (msg.type === 'voice') {
            content = `<audio controls src="${msg.file}"></audio>`;
        }

        msgEl.innerHTML = `<strong>${msg.sender}:</strong> ${content} <span style="font-size: 0.7em;">(${msg.timestamp})</span>`;
        container.appendChild(msgEl);
    });

    container.scrollTop = container.scrollHeight;
}

// ---------- Profile ----------
function loadProfile() {
    const profile = document.getElementById('profile-details');
    profile.innerHTML = `
        <strong>Name:</strong> ${currentUser.username}<br>
        <strong>Bio:</strong> ${currentUser.bio}
    `;
    document.getElementById('followers-count').textContent = currentUser.followers;
    loadProfilePosts();
}

function loadProfilePosts() {
    const container = document.getElementById('user-posts');
    container.innerHTML = '';
    const userPosts = posts.filter(p => p.author === currentUser.username);
    userPosts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.innerHTML = `
            <p>${post.content}</p>
            ${post.imageURL ? `<img src="${post.imageURL}" style="max-width:100%; margin-top:10px;">` : ''}
            <div style="font-size:0.8rem; margin-top:5px;">${post.timestamp}</div>
        `;
        container.appendChild(postEl);
    });
}

function editProfile() {
    const newBio = prompt("Edit your object bio:", currentUser.bio);
    if (newBio !== null && newBio.trim()) {
        currentUser.bio = newBio.trim();
        loadProfile();
    }
}

function shareProfile() {
    alert("Profile shared! 📢 (Pretend we posted it somewhere)");
}

// ---------- Forgot Password Placeholder ----------
function showForgotPassword() {
    alert("Objects can't reset passwords yet! 😅");
}
