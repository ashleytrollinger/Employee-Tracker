INSERT INTO department (department_name)
VALUES
    ("Guest Services"),
    ("Aquatics"),
    ("Arcade");

INSERT INTO role (title, salary, department_ID)
VALUES
    ("Guest Service Manager", 100000, "Guest Services"),
    ("Guest Service Agent", 10000, "Guest Services"),
    ("Aquatics Manager", 100000, "Aquatics"),
    ("Lifeguard", 25000, "Aquatics"),
    ("Water Attendant", 13000, "Aquatics"),
    ("Arcade Manager", 90000, "Arcade"),
    ("Arcade Attendant", 25000, "Arcade");

INSERT INTO employee (first_name, last_name, role_ID, manager_ID)
VALUES
    ("Taron", "Bryant", 1, NULL),
    ("James", "Fries", 2, "Taron"),
    ("Louy", "Miller", 2, "Taron"),
    ("Zach", "Shifflet", 3, NULL),
    ("Tyler", "Jones", 4, "Zach"),
    ("Savannah", "Lee", 5, "Zach"),
    ("Kat", "Stevenson", 6, NULL),
    ("Noah", "Murcura", 7, "Kat");


