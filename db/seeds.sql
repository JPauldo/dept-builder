INSERT INTO department (name)
     VALUES ("Kanto"),
            ("Johto");

INSERT INTO role (title, salary, department_id)
     VALUES ("Gym Leader", 30690.00, 1),
            ("Elite Four", 58410.00, 1),
            ("Champion", 64350.00, 1),
            ("Gym Leader", 25500.00, 2),
            ("Elite Four", 44750.00, 2),
            ("Champion", 50000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
     VALUES ("Blue", "Oak", 1, NULL),
            ("Brock", "Nibi", 1, 1),
            ("Misty", "Hanada", 1, 1),
            ("Surge", "Kuchiba", 1, 1),
            ("Erika", "Tamamushi", 1, 1),
            ("Koga", "Sekichiku", 1, 1),
            ("Sabrina", "Yamabuki", 1, 1),
            ("Blaine", "Guren", 1, 1),
            ("Giovanni", "Tokiwa", 1, 1),
            ("Lorelei", "Prima", 1, 1),
            ("Bruno", "Takenori", 1, 1),
            ("Agatha", "Cion", 1, 1),
            ("Lance", "Fusube", 1, 1),
            ("Red", "Masara", 1, NULL),
            ("Falkner", "Kikyo", 1, 14),
            ("Bugsy", "Hiwada", 1, 14),
            ("Will", "Natio", 1, 14),
            ("Karen", "Blacki", 1, 14);

SELECT *
  FROM department;

SELECT *
  FROM role;

SELECT *
  FROM employee;
