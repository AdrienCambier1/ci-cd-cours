INSERT INTO users (
    nom,
    prenom,
    email,
    birthdate,
    city,
    postal_code
)
SELECT
    'Dupont',
    'Jean',
    'jean.dupont@example.com',
    '2000-01-15',
    'Paris',
    '75001'
WHERE NOT EXISTS (
    SELECT 1
    FROM users
    WHERE email = 'jean.dupont@example.com'
);