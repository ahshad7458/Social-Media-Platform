async function fetchPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    displayPosts(posts);
}

function displayPosts(posts) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `
            <h3>${post.user}</h3>
            <p>${post.content}</p>
            <button onclick="likePost(${post.id})">Like</button>
            <p>${post.likes.length} likes</p>
        `;
        container.appendChild(postDiv);
    });
}

async function likePost(postId) {
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    fetchPosts();
}

document.addEventListener('DOMContentLoaded', fetchPosts);


const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/social_platform', { useNewUrlParser: true, useUnifiedTopology: true });

const Post = mongoose.model('Post', new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    created_at: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.listen(3000, () => console.log('Server running on port 3000'));
