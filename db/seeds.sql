INSERT INTO department (department_name)
VALUES
    ("Guest Services"),
    ("Aquatics"),
    ("Arcade");

INSERT INTO role (title, salary, department_ID)
VALUES
    ("Guest Service Manager", 100000, 1),
    ("Guest Service Agent", 10000, 1),
    ("Aquatics Manager", 100000, 2),
    ("Lifeguard", 25000, 2),
    ("Water Attendant", 13000, 2),
    ("Arcade Manager", 90000, 3),
    ("Arcade Attendant", 25000, 3);

INSERT INTO employee (first_name, last_name, role_ID, manager)
VALUES
    ("Taron", "Bryant", 1, NULL),
    ("James", "Fries", 2, 1),
    ("Louy", "Miller", 2, 1),
    ("Zach", "Shifflet", 3, NULL),
    ("Tyler", "Jones", 4, 4),
    ("Savannah", "Lee", 5, 4),
    ("Kat", "Stevenson", 6, NULL),
    ("Noah", "Murcura", 7, 7);


