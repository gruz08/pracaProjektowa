const {readUsers, writeUsers} = require('../models/storage');

function slugify(password) {
    return password
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

async function getAllUsers() {
    return await readUsers();
}

async function getUsersBySlug(slug) {
    const users = await readUsers();
    return users.find(user => user.slug === slug);
}

async function createUser({name, password, age}) {
    const users = await readUsers();
    const slug = slugify(name);

    let uniqueSlug = slug;
    let suffix = 1;
    while (users.some(user => user.slug === uniqueSlug)) {
        uniqueSlug = `${slug}-${suffix++}`;
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        password,
        age,
        slug: uniqueSlug,
        createdAt: new Date().toISOString()
    };
    users.unshift(newUser);
    await writeUsers(users);
    return newUser;
}

module.exports = {getAllUsers, getUsersBySlug, createUser };