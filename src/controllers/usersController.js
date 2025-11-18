const { name } = require('ejs');
const userService = require('../services/usersService');

async function index(req, res) {
    const users = await userService.getAllUsers();
    res.render('users/list', {name: "Użytkownicy", users });
}

async function show(req, res) {
    const slug = req.params.slug;
    const user = await userService.getUsersBySlug(slug);

    if (!user) return res.status(404).render('users/error', { name: "Nie znaleziono" });

    res.render('users/show', { name: user.name, user });
}

async function create(req, res) {
    const { name, password, age } = req.body;

    const errors = [];
    const hasDigit = /(?=.*\d)/;
    const hasUppercase = /(?=.*[A-Z])/;
    const minLength = /.{6,}/;

    if (!name || name.trim().length < 2) errors.push("Imię musi mieć co najmniej 2 znaki.");
    if (!age || age < 18) errors.push("Aby się zarejestrować musisz mieć 18 lat");
    if (!hasDigit.test(password) || !hasUppercase.test(password) || !minLength.test(password)) {
        errors.push("Hasło musi mieć min. 6 znaków, jedną cyfrę i jedną dużą literę.");
    }

    if (errors.length > 0) {
        return res.status(400).render('users/new', {
            name: "Nowy użytkownik",
            errors,
            values: req.body,
        });
    }

    const user = await userService.createUser({ name, password, age });

    return res.redirect(`/users/${user.slug}`); // JEDYNE PRAWIDŁOWE !!!
}


async function newForm(req, res) {
    res.render('users/new',{
            name: "Nowy użytwkonik",
            errors: null,
            values: {}
        });
}

module.exports = { index, show, create, newForm };