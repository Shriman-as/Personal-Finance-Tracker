INSERT INTO transactions (description, amount, transaction_type, category, auto_tagged, timestamp)
VALUES ('Salary September', 5000.00, 'income', 'Salary', 1, datetime('now','-40 days')),
       ('Rent September', -1200.00, 'expense', 'Rent', 1, datetime('now','-30 days')),
       ('McDonald''s lunch', -12.50, 'expense', 'Food', 1, datetime('now','-20 days')),
       ('Uber ride home', -6.75, 'expense', 'Transport', 1, datetime('now','-18 days')),
       ('Netflix subscription', -9.99, 'expense', 'Entertainment', 1, datetime('now','-10 days')),
       ('Freelance payment', 300.00, 'income', 'Salary', 1, datetime('now','-5 days'));
